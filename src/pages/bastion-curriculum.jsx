import { useState } from "react";

/* =====================================================================
   DATA
   ===================================================================== */
const METHODS = [
  {
    id: "ssh-bastion",
    label: "従来型 SSH 踏み台",
    icon: "🔑",
    badge: "Classic",
    badgeColor: "#94a3b8",
    accentColor: "#64748b",
    glowColor: "rgba(100,116,139,0.3)",
    risk: "high",
    cost: "中",
    complexity: "中",
    summary: "パブリックサブネットに踏み台EC2を配置し、SSH ProxyJumpでプライベートEC2へ到達する古典的手法。",
    pros: ["構成がシンプルで理解しやすい", "ツール不要（ssh コマンドのみ）", "オンプレ環境でも同様の手順"],
    cons: ["22番ポート開放が必要", "公開鍵管理が煩雑", "踏み台EC2の維持コスト", "侵害時のリスクが高い"],
    steps: [
      {
        title: "VPC・サブネット設計",
        type: "setup",
        duration: "20分",
        body: `# パブリックサブネット（踏み台用）とプライベートサブネット（対象EC2）を作成
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications \\
  'ResourceType=vpc,Tags=[{Key=Name,Value=bastion-lab}]'

# パブリックサブネット
aws ec2 create-subnet --vpc-id vpc-XXXXX \\
  --cidr-block 10.0.1.0/24 --availability-zone ap-northeast-1a \\
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=public-1a}]'

# プライベートサブネット
aws ec2 create-subnet --vpc-id vpc-XXXXX \\
  --cidr-block 10.0.10.0/24 --availability-zone ap-northeast-1a \\
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=private-1a}]'`,
        tip: "踏み台はパブリックサブネット、対象サーバはプライベートサブネットに配置するのが大原則。",
      },
      {
        title: "セキュリティグループ設定",
        type: "security",
        duration: "15分",
        body: `# 踏み台SG: 自社IPからの22番のみ許可
aws ec2 create-security-group \\
  --group-name sg-bastion \\
  --description "Bastion SSH" --vpc-id vpc-XXXXX

aws ec2 authorize-security-group-ingress \\
  --group-id sg-BASTION \\
  --protocol tcp --port 22 --cidr 203.0.113.0/32  # ← 自社の固定IPに変更

# 対象サーバSG: 踏み台SGからの22番のみ許可（CIDRではなくSG参照）
aws ec2 create-security-group \\
  --group-name sg-private --description "Private EC2" --vpc-id vpc-XXXXX

aws ec2 authorize-security-group-ingress \\
  --group-id sg-PRIVATE \\
  --protocol tcp --port 22 --source-group sg-BASTION`,
        tip: "対象SGの許可元は踏み台のCIDRではなく踏み台のSGを参照する。IPが変わっても変更不要になる。",
      },
      {
        title: "踏み台EC2とターゲットEC2の起動",
        type: "launch",
        duration: "15分",
        body: `# 踏み台EC2（パブリックサブネット、EIPあり）
aws ec2 run-instances \\
  --image-id ami-xxxxxxxxx --instance-type t3.nano \\
  --subnet-id subnet-PUBLIC --security-group-ids sg-BASTION \\
  --key-name my-key --associate-public-ip-address \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=bastion}]'

# ターゲットEC2（プライベートサブネット、パブリックIPなし）
aws ec2 run-instances \\
  --image-id ami-xxxxxxxxx --instance-type t3.small \\
  --subnet-id subnet-PRIVATE --security-group-ids sg-PRIVATE \\
  --key-name my-key \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=target}]'`,
        tip: "踏み台はt3.nanoで十分。プライベートEC2にEIPは不要（踏み台経由でのみアクセス）。",
      },
      {
        title: "SSH ProxyJump で接続",
        type: "connect",
        duration: "15分",
        body: `# ~/.ssh/config に以下を追記
Host bastion
  HostName 203.0.113.10       # 踏み台のEIP
  User ec2-user
  IdentityFile ~/.ssh/my-key.pem

Host private-ec2
  HostName 10.0.10.50         # プライベートEC2のプライベートIP
  User ec2-user
  IdentityFile ~/.ssh/my-key.pem
  ProxyJump bastion           # ← 踏み台を経由

# 接続コマンド（1行で直接プライベートEC2へ）
ssh private-ec2

# または ProxyJump を明示的に指定
ssh -J ec2-user@203.0.113.10 ec2-user@10.0.10.50 -i ~/.ssh/my-key.pem`,
        tip: "ProxyJumpはSSH 7.3以降で利用可能。古いクライアントではProxyCommandを使う。",
      },
    ],
  },
  {
    id: "ssm-session",
    label: "SSM Session Manager",
    icon: "🖥️",
    badge: "推奨",
    badgeColor: "#22c55e",
    accentColor: "#16a34a",
    glowColor: "rgba(34,197,94,0.25)",
    risk: "low",
    cost: "低",
    complexity: "中",
    summary: "SSM Agentを使い、ポート開放・踏み台EC2・SSH鍵なしでプライベートEC2にセッションを開始できる。",
    pros: ["SSH/22番ポート不要", "EC2キーペア不要", "セッションログをS3/CloudWatch Logsへ記録", "IAMポリシーで細かい制御"],
    cons: ["SSM Agentのインストールと設定が必要", "インターネット接続またはVPCエンドポイントが必要", "承認フローは別途（後述のJIT）"],
    steps: [
      {
        title: "IAMロール（EC2インスタンスプロファイル）の作成",
        type: "setup",
        duration: "15分",
        body: `# SSM管理ポリシーをアタッチしたロールを作成
aws iam create-role --role-name EC2-SSM-Role \\
  --assume-role-policy-document '{
    "Version":"2012-10-17",
    "Statement":[{
      "Effect":"Allow",
      "Principal":{"Service":"ec2.amazonaws.com"},
      "Action":"sts:AssumeRole"
    }]
  }'

# AmazonSSMManagedInstanceCore をアタッチ（最小権限）
aws iam attach-role-policy \\
  --role-name EC2-SSM-Role \\
  --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore

# インスタンスプロファイルを作成してロールを追加
aws iam create-instance-profile --instance-profile-name EC2-SSM-Profile
aws iam add-role-to-instance-profile \\
  --instance-profile-name EC2-SSM-Profile --role-name EC2-SSM-Role`,
        tip: "AmazonSSMManagedInstanceCoreのみで十分。FullAccessは不要で付与しないこと。",
      },
      {
        title: "VPCエンドポイントの設定（インターネット不要構成）",
        type: "network",
        duration: "20分",
        body: `# プライベートEC2がインターネット経由でSSMと通信できない場合に必要
# 以下の3つのエンドポイントを作成

for SERVICE in ssm ssmmessages ec2messages; do
  aws ec2 create-vpc-endpoint \\
    --vpc-id vpc-XXXXX \\
    --vpc-endpoint-type Interface \\
    --service-name com.amazonaws.ap-northeast-1.$SERVICE \\
    --subnet-ids subnet-PRIVATE \\
    --security-group-ids sg-ENDPOINT \\
    --private-dns-enabled
done

# エンドポイント用SGは443番をVPC CIDRから許可
aws ec2 authorize-security-group-ingress \\
  --group-id sg-ENDPOINT \\
  --protocol tcp --port 443 --cidr 10.0.0.0/16`,
        tip: "3エンドポイント(ssm, ssmmessages, ec2messages)がセット。S3エンドポイント(Gateway型)も追加推奨。",
      },
      {
        title: "EC2起動とAgent確認",
        type: "launch",
        duration: "10分",
        body: `# インスタンスプロファイルを付与してEC2起動（SG: 443アウトバウンドのみ）
aws ec2 run-instances \\
  --image-id ami-xxxxxxxxx --instance-type t3.small \\
  --subnet-id subnet-PRIVATE \\
  --iam-instance-profile Name=EC2-SSM-Profile \\
  --no-associate-public-ip-address \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=ssm-target}]'

# Amazon Linux 2 / 2023はSSM Agentプリインストール済み
# Ubuntu等は手動インストールが必要
# sudo snap install amazon-ssm-agent --classic
# sudo systemctl start amazon-ssm-agent

# マネージドノードとして認識されているか確認（2〜3分待つ）
aws ssm describe-instance-information \\
  --query 'InstanceInformationList[*].{ID:InstanceId,Ping:PingStatus,Platform:PlatformName}'`,
        tip: "PingStatusが\"Online\"になったらSession Manager接続可能。\"Connection Lost\"の場合はIAMロールとエンドポイントを確認。",
      },
      {
        title: "Session Managerで接続",
        type: "connect",
        duration: "10分",
        body: `# CLIでセッション開始（Session Manager Pluginが必要）
# Plugin インストール: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html

aws ssm start-session --target i-XXXXXXXXXXXXXXXXX

# SSH over Session Manager（ポートフォワーディング）
# ~/.ssh/config に追記
Host i-* mi-*
  ProxyCommand aws ssm start-session \\
    --target %h \\
    --document-name AWS-StartSSHSession \\
    --parameters 'portNumber=%p'

# 通常のSSHと同じコマンドで接続（キー認証）
ssh -i ~/.ssh/my-key.pem ec2-user@i-XXXXXXXXXXXXXXXXX

# ポートフォワーディング（例: リモートDB 5432 → ローカル 15432）
aws ssm start-session --target i-XXXXXXXXXXXXXXXXX \\
  --document-name AWS-StartPortForwardingSession \\
  --parameters '{"portNumber":["5432"],"localPortNumber":["15432"]}'`,
        tip: "AWSコンソール→EC2→インスタンス→「接続」→「Session Manager」タブからブラウザで即接続も可能。",
      },
      {
        title: "セッションログの記録設定",
        type: "audit",
        duration: "15分",
        body: `# セッションログをS3とCloudWatch Logsへ転送
aws ssm update-service-setting \\
  --setting-id /ssm/managed-instance/activation-tier \\
  --setting-value standard

# Session Managerの設定をJSONで更新
aws ssm put-parameter \\
  --name "/ssm/session-manager/preferences" \\
  --type "String" \\
  --value '{
    "s3BucketName": "my-session-logs",
    "s3KeyPrefix": "session-logs/",
    "s3EncryptionEnabled": true,
    "cloudWatchLogGroupName": "/ssm/session-manager",
    "cloudWatchEncryptionEnabled": true,
    "cloudWatchStreamingEnabled": true,
    "runAsEnabled": false,
    "idleSessionTimeout": "20",
    "kmsKeyId": "arn:aws:kms:..."
  }'`,
        tip: "コンソールでは Systems Manager→Session Manager→設定タブから同じ設定が可能。監査目的で必ず有効化する。",
      },
    ],
  },
  {
    id: "ssm-jit",
    label: "JIT Node Access（承認フロー）",
    icon: "🔐",
    badge: "NEW 2025",
    badgeColor: "#f59e0b",
    accentColor: "#d97706",
    glowColor: "rgba(245,158,11,0.25)",
    risk: "minimal",
    cost: "低〜中",
    complexity: "高",
    summary: "2025年3月リリース。承認者の許可を経てのみセッションを開始できる「ゼロ常時権限」モデル。Organizations必須。",
    pros: ["常設権限ゼロ（Zero Standing Privileges）", "承認ワークフローで人間によるゲートキープ", "アクセスリクエストの完全な監査証跡", "ManualApproval / AutoApprovalポリシーを使い分け"],
    cons: ["AWS Organizations / 統合コンソールが前提", "30日間の無料トライアル後は有料", "Single Sign-Onでのリモートデスクトップ非対応", "同一アカウント・リージョン内のみ（2025年5月時点）"],
    steps: [
      {
        title: "前提条件の確認",
        type: "setup",
        duration: "10分",
        body: `# 前提: AWS Organizations の管理アカウントまたは委任管理者アカウントで実施
# 1. Organizations の設定確認
aws organizations describe-organization \\
  --query 'Organization.{Id:Id,MasterAccountId:MasterAccountId}'

# 2. Systems Manager の統合コンソール（Unified Console）を有効化済みか確認
#    コンソール: Systems Manager → 左メニュー「Just-in-time node access」
#    「Enable the new experience」ボタンをクリック（GUIのみ）

# 3. 必要なIAM権限（管理者アカウントで実行するユーザに付与）
#    ssm-quicksetup:*, cloudformation:*, organizations:List/Describe*, iam:CreateRole 等
#    ※ドキュメントのAdministrator用ポリシーを参照

# 4. 一時的なセキュリティ認証情報（AssumeRole）が必須
#    IAMユーザーの長期クレデンシャルは非対応
aws sts get-caller-identity  # RoleArn が含まれていることを確認`,
        tip: "IAMユーザーの直接クレデンシャルは非対応。AWS SSOやassumed roleで操作すること。",
      },
      {
        title: "Just-in-Time Node Access の有効化",
        type: "setup",
        duration: "20分",
        body: `# ステップ1: AWSコンソールで有効化（CLI未サポートのステップ）
# Systems Manager → Just-in-time node access → Enable the new experience
# → 対象OUとリージョンを選択 → 有効化

# ステップ2: JIT用IAMロールがCloudFormation StackSetで自動作成される
# 確認コマンド
aws cloudformation list-stack-sets \\
  --query 'Summaries[?contains(StackSetName,\`JITNA\`)].StackSetName'

# ステップ3: ユーザー用IAMポリシー（アクセスリクエスト権限）
cat > jit-user-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:StartAccessRequest",
        "ssm:GetAccessToken",
        "ssm:DescribeAccessRequest"
      ],
      "Resource": "*"
    }
  ]
}
EOF
aws iam create-policy --policy-name JIT-User-Policy \\
  --policy-document file://jit-user-policy.json`,
        tip: "有効化後、既存のStartSessionパーミッションをIAMポリシーから削除して初めてJITのみの運用になる。段階的に移行すること。",
      },
      {
        title: "承認ポリシーの作成（ManualApprovalPolicy）",
        type: "security",
        duration: "25分",
        body: `# 本番環境タグを持つノードは手動承認必須にするポリシー
cat > manual-approval-policy.json << 'EOF'
{
  "schemaVersion": "1.0",
  "description": "Require manual approval for Production nodes",
  "approvers": [
    {
      "approverType": "IamRole",
      "approver": "arn:aws:iam::111122223333:role/SecurityApproverRole",
      "minRequiredApprovals": 1
    }
  ],
  "requesterFeedback": "enabled",
  "sessionDuration": "PT1H",
  "targets": [
    {
      "key": "tag:Environment",
      "values": ["Production"]
    }
  ]
}
EOF

# ManualApprovalPolicyドキュメントとして登録
aws ssm create-document \\
  --name "ProdManualApproval" \\
  --document-type "ManualApprovalPolicy" \\
  --content file://manual-approval-policy.json

# 自動承認ポリシー（開発環境は即時許可）
cat > auto-approval-policy.json << 'EOF'
{
  "schemaVersion": "1.0",
  "description": "Auto approve for Dev nodes",
  "sessionDuration": "PT30M",
  "targets": [
    {
      "key": "tag:Environment",
      "values": ["Development"]
    }
  ]
}
EOF
aws ssm create-document \\
  --name "DevAutoApproval" \\
  --document-type "AutoApprovalPolicy" \\
  --content file://auto-approval-policy.json`,
        tip: "ポリシーの優先度: 最も具体的なポリシー（タグの一致度が高い）が優先される。複数のManualApprovalが同一ノードにマッチするとアクセス不可になるので注意。",
      },
      {
        title: "アクセスリクエストの申請（申請者側）",
        type: "connect",
        duration: "15分",
        body: `# アクセスリクエストを作成（承認待ち状態になる）
aws ssm start-access-request \\
  --target i-XXXXXXXXXXXXXXXXX \\
  --reason "本番DBのパラメータ確認。チケット: OPS-1234"

# リクエストIDを確認
# 出力例: { "AccessRequestId": "ar-XXXXXXXXXX" }

# リクエストのステータスを確認
aws ssm describe-access-request \\
  --access-request-id ar-XXXXXXXXXX

# 承認されたらアクセストークンを取得
aws ssm get-access-token \\
  --access-request-id ar-XXXXXXXXXX

# トークンを使ってセッション開始（承認後のみ可能）
aws ssm start-session \\
  --target i-XXXXXXXXXXXXXXXXX \\
  --access-token <AccessToken>

# コンソールでも: EC2 → インスタンス → 「接続」→「Just-in-time node access」タブ`,
        tip: "reasonフィールドに目的とチケット番号を記載することを運用ルール化すると監査証跡が充実する。",
      },
      {
        title: "承認フロー（承認者側）",
        type: "audit",
        duration: "10分",
        body: `# 承認者側の操作（SecurityApproverRoleを持つユーザ）

# 保留中のリクエスト一覧を確認
aws ssm describe-access-requests \\
  --filter Key=Status,Values=Pending \\
  --query 'AccessRequests[*].{ID:AccessRequestId,Target:Target,Requester:RequesterId,Reason:Reason}'

# OpsCenter経由でも確認可能
aws ssm get-ops-summary \\
  --filters Key=OpsItemType,Values=/aws/AccessRequest

# リクエストを承認
aws ssm update-ops-item \\
  --ops-item-id oi-XXXXXXXXXX \\
  --status Resolved \\
  --operational-data '{"/aws/AccessRequestApproval":{"Value":"Approved","Type":"SearchableString"}}'

# または却下
# --operational-data '{"/aws/AccessRequestApproval":{"Value":"Rejected","Type":"SearchableString"}}'

# SNS通知を設定して承認依頼をSlack等へ連携する場合
aws sns subscribe \\
  --topic-arn arn:aws:sns:ap-northeast-1:111122223333:jit-approval-topic \\
  --protocol https \\
  --notification-endpoint https://hooks.slack.com/...`,
        tip: "承認通知はEventBridge + SNS + Lambdaを組み合わせてSlack/Teamsへのメンション送信が可能。承認SLAを定めておくと運用しやすい。",
      },
    ],
  },
  {
    id: "ec2-connect",
    label: "EC2 Instance Connect",
    icon: "🌐",
    badge: "簡単",
    badgeColor: "#3b82f6",
    accentColor: "#2563eb",
    glowColor: "rgba(59,130,246,0.25)",
    risk: "medium",
    cost: "無料",
    complexity: "低",
    summary: "AWS APIで一時的なSSH公開鍵をEC2に注入し、60秒間のみ有効な鍵でSSH接続する。",
    pros: ["永続的なキーペア管理が不要", "60秒の一時鍵で安全", "IAMポリシーでユーザー制御", "EC2 Instance Connect Endpoint経由ならVPN不要"],
    cons: ["パブリックEC2は22番ポート必要（EICEは不要）", "Linuxのみ（Windowsはほぼ非対応）", "Amazon Linux / Ubuntu のみ公式サポート"],
    steps: [
      {
        title: "EC2 Instance Connect Endpoint（EICE）の作成",
        type: "setup",
        duration: "15分",
        body: `# EICEを使うとSSHポートを外部公開せずに接続できる（2023年5月〜）
aws ec2 create-instance-connect-endpoint \\
  --subnet-id subnet-PRIVATE \\
  --security-group-ids sg-EICE \\
  --tag-specifications \\
    'ResourceType=instance-connect-endpoint,Tags=[{Key=Name,Value=my-eice}]'

# EICEのSGアウトバウンド: ターゲットEC2のSGへ22番許可
aws ec2 authorize-security-group-egress \\
  --group-id sg-EICE \\
  --protocol tcp --port 22 --source-group sg-TARGET

# ターゲットEC2のSGインバウンド: EICEのSGから22番許可
aws ec2 authorize-security-group-ingress \\
  --group-id sg-TARGET \\
  --protocol tcp --port 22 --source-group sg-EICE

# 作成完了確認（State: create-complete になるまで待つ）
aws ec2 describe-instance-connect-endpoints \\
  --query 'InstanceConnectEndpoints[*].{ID:InstanceConnectEndpointId,State:State}'`,
        tip: "EICEはVPCエンドポイントとは異なり、1サブネットに1つ作成する。作成に5〜10分かかることがある。",
      },
      {
        title: "IAMポリシーの設定",
        type: "security",
        duration: "10分",
        body: `# EIC経由の接続を許可するポリシー
cat > eic-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ec2-instance-connect:SendSSHPublicKey",
      "Resource": "arn:aws:ec2:ap-northeast-1:111122223333:instance/*",
      "Condition": {
        "StringEquals": {
          "ec2:osuser": "ec2-user"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": "ec2-instance-connect:OpenTunnel",
      "Resource": "arn:aws:ec2:ap-northeast-1:111122223333:instance-connect-endpoint/eice-XXXXX"
    },
    {
      "Effect": "Allow",
      "Action": "ec2:DescribeInstances",
      "Resource": "*"
    }
  ]
}
EOF`,
        tip: "ec2:osuserでLinuxのOSユーザを制限できる。ec2-userのみ許可してrootは禁止にするのがベストプラクティス。",
      },
      {
        title: "EICEを使ったSSH接続",
        type: "connect",
        duration: "10分",
        body: `# 方法1: AWS CLIでワンライナー接続（鍵自動生成）
aws ec2-instance-connect ssh \\
  --instance-id i-XXXXXXXXXXXXXXXXX \\
  --connection-type eice

# 方法2: 既存鍵を使ってSSH（ProxyCommand経由）
# ~/.ssh/config
Host i-* mi-*
  User ec2-user
  IdentityFile ~/.ssh/my-key.pem
  ProxyCommand aws ec2-instance-connect open-tunnel \\
    --instance-id %h \\
    --remote-port %p \\
    --local-port %p

ssh i-XXXXXXXXXXXXXXXXX

# 方法3: コンソール（ブラウザベース）
# EC2 → インスタンス → 「接続」→ 「EC2 Instance Connect」タブ
# → 「EC2 Instance Connect エンドポイントを使用して接続する」を選択`,
        tip: "aws ec2-instance-connect ssh コマンドは内部で一時鍵を生成・注入・接続を自動化する。最もシンプルな方法。",
      },
    ],
  },
];

/* =====================================================================
   COMPONENT
   ===================================================================== */
const typeStyle = {
  setup:    { label: "Setup",    color: "#60a5fa" },
  security: { label: "Security", color: "#f472b6" },
  network:  { label: "Network",  color: "#a78bfa" },
  launch:   { label: "Launch",   color: "#34d399" },
  connect:  { label: "Connect",  color: "#fbbf24" },
  audit:    { label: "Audit",    color: "#fb923c" },
};

const riskLabel = { high: "⚠️ 高", medium: "⚡ 中", low: "✅ 低", minimal: "🛡️ 最小" };
const riskColor = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e", minimal: "#10b981" };

export default function BastionCurriculum() {
  const [activeMethod, setActiveMethod] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(new Set());

  const method = METHODS[activeMethod];
  const step = method.steps[activeStep];
  const stepKey = `${activeMethod}-${activeStep}`;

  const toggle = (key) => setCompleted(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

  const totalSteps = METHODS.reduce((a, m) => a + m.steps.length, 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060a12",
      color: "#c9d8f0",
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* ── TOP BAR ── */}
      <div style={{
        borderBottom: "1px solid #0f1e33",
        background: "linear-gradient(180deg,#0b1120 0%,#060a12 100%)",
        padding: "18px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `linear-gradient(135deg,${method.accentColor},#0f1e33)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, flexShrink: 0,
            boxShadow: `0 0 18px ${method.glowColor}`,
            transition: "box-shadow 0.4s",
          }}>🏰</div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#334866", textTransform: "uppercase" }}>
              AWS HANDS-ON CURRICULUM
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#e8f0ff", letterSpacing: -0.5 }}>
              踏み台サーバー接続マスターコース
            </div>
          </div>

          {/* progress */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "#334866" }}>完了ステップ</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: method.accentColor }}>
                {completed.size}<span style={{ fontSize: 12, color: "#334866" }}>/{totalSteps}</span>
              </div>
            </div>
            <div style={{ width: 80, height: 4, background: "#0f1e33", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${(completed.size / totalSteps) * 100}%`,
                background: `linear-gradient(90deg,${method.accentColor},#60a5fa)`,
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>
        </div>

        {/* ── METHOD SELECTOR ── */}
        <div style={{ display: "flex", gap: 8, marginTop: 16, overflowX: "auto", paddingBottom: 4 }}>
          {METHODS.map((m, i) => (
            <button key={i} onClick={() => { setActiveMethod(i); setActiveStep(0); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 14px", borderRadius: 8, whiteSpace: "nowrap",
                border: `1px solid ${activeMethod === i ? m.accentColor : "#0f1e33"}`,
                background: activeMethod === i ? `${m.accentColor}18` : "transparent",
                color: activeMethod === i ? "#e8f0ff" : "#4a6580",
                cursor: "pointer", fontFamily: "inherit", fontSize: 12,
                transition: "all 0.2s",
                boxShadow: activeMethod === i ? `0 0 12px ${m.glowColor}` : "none",
              }}>
              <span style={{ fontSize: 16 }}>{m.icon}</span>
              <span>{m.label}</span>
              <span style={{
                fontSize: 9, padding: "2px 6px", borderRadius: 10,
                background: `${m.badgeColor}22`, color: m.badgeColor,
                border: `1px solid ${m.badgeColor}44`,
              }}>{m.badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── LEFT: method overview ── */}
        <div style={{
          width: 230, borderRight: "1px solid #0f1e33",
          background: "#060d18", padding: "16px 12px",
          overflowY: "auto", flexShrink: 0,
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          {/* summary */}
          <div style={{
            padding: 12, borderRadius: 8,
            background: `${method.accentColor}0e`,
            border: `1px solid ${method.accentColor}30`,
            fontSize: 11, color: "#8aaacb", lineHeight: 1.6,
          }}>
            {method.summary}
          </div>

          {/* stats */}
          {[
            ["セキュリティリスク", riskLabel[method.risk], riskColor[method.risk]],
            ["コスト", method.cost, "#94a3b8"],
            ["構築難易度", method.complexity, "#94a3b8"],
          ].map(([label, val, color]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#334866" }}>{label}</span>
              <span style={{ fontSize: 11, color, fontWeight: 600 }}>{val}</span>
            </div>
          ))}

          <div style={{ height: 1, background: "#0f1e33" }} />

          {/* pros/cons */}
          <div>
            <div style={{ fontSize: 10, color: "#334866", letterSpacing: 2, marginBottom: 8 }}>PROS</div>
            {method.pros.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5, fontSize: 11, color: "#8aaacb", lineHeight: 1.5 }}>
                <span style={{ color: "#22c55e", flexShrink: 0 }}>+</span>{p}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#334866", letterSpacing: 2, marginBottom: 8 }}>CONS</div>
            {method.cons.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5, fontSize: 11, color: "#8aaacb", lineHeight: 1.5 }}>
                <span style={{ color: "#ef4444", flexShrink: 0 }}>−</span>{c}
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: "#0f1e33" }} />

          {/* step list */}
          <div style={{ fontSize: 10, color: "#334866", letterSpacing: 2, marginBottom: 4 }}>STEPS</div>
          {method.steps.map((s, i) => {
            const key = `${activeMethod}-${i}`;
            const isActive = i === activeStep;
            const isDone = completed.has(key);
            const ts = typeStyle[s.type];
            return (
              <button key={i} onClick={() => setActiveStep(i)}
                style={{
                  width: "100%", textAlign: "left",
                  padding: "10px 10px", borderRadius: 7,
                  border: `1px solid ${isActive ? method.accentColor : "#0f1e33"}`,
                  background: isActive ? `${method.accentColor}12` : "transparent",
                  cursor: "pointer", fontFamily: "inherit",
                  marginBottom: 4, transition: "all 0.15s",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{
                    fontSize: 9, padding: "2px 5px", borderRadius: 4,
                    color: ts.color, background: `${ts.color}18`,
                    border: `1px solid ${ts.color}40`,
                  }}>{ts.label}</span>
                  <span style={{ fontSize: 11, color: isDone ? "#22c55e" : "#1e3a5f" }}>
                    {isDone ? "✓" : `${i + 1}`}
                  </span>
                </div>
                <div style={{
                  fontSize: 11, color: isActive ? "#c9d8f0" : "#4a6580",
                  lineHeight: 1.4, fontWeight: isActive ? 600 : 400,
                }}>{s.title}</div>
                <div style={{ fontSize: 10, color: "#1e3a5f", marginTop: 3 }}>⏱ {s.duration}</div>
              </button>
            );
          })}
        </div>

        {/* ── RIGHT: step detail ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          {/* header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <span style={{
                  fontSize: 10, padding: "3px 8px", borderRadius: 5,
                  color: typeStyle[step.type].color,
                  background: `${typeStyle[step.type].color}18`,
                  border: `1px solid ${typeStyle[step.type].color}40`,
                }}>{typeStyle[step.type].label}</span>
                <span style={{ fontSize: 11, color: "#334866" }}>⏱ {step.duration}</span>
                <span style={{ fontSize: 11, color: "#334866" }}>
                  Step {activeStep + 1} / {method.steps.length}
                </span>
              </div>
              <h2 style={{
                margin: 0, fontSize: 20, color: "#e8f0ff",
                letterSpacing: -0.5, fontFamily: "inherit",
              }}>{step.title}</h2>
            </div>
            <button onClick={() => toggle(stepKey)}
              style={{
                padding: "8px 16px", borderRadius: 8,
                border: `1px solid ${completed.has(stepKey) ? "#22c55e" : "#0f1e33"}`,
                background: completed.has(stepKey) ? "#22c55e14" : "transparent",
                color: completed.has(stepKey) ? "#22c55e" : "#334866",
                cursor: "pointer", fontFamily: "inherit", fontSize: 12,
                transition: "all 0.2s",
              }}>
              {completed.has(stepKey) ? "✓ 完了" : "完了にする"}
            </button>
          </div>

          {/* code block */}
          <div style={{
            background: "#040810",
            border: "1px solid #0f1e33",
            borderRadius: 10, overflow: "hidden",
            marginBottom: 16,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 16px",
              borderBottom: "1px solid #0f1e33",
              background: "#06101c",
            }}>
              {["#ef4444","#f59e0b","#22c55e"].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.6 }} />
              ))}
              <span style={{ fontSize: 10, color: "#1e3a5f", marginLeft: 4 }}>bash</span>
            </div>
            <div style={{ padding: "20px", overflowX: "auto" }}>
              <pre style={{
                margin: 0, fontSize: 11, lineHeight: 1.75,
                color: "#7dd3fc", whiteSpace: "pre-wrap", wordBreak: "break-word",
              }}>{step.body}</pre>
            </div>
          </div>

          {/* tip */}
          <div style={{
            display: "flex", gap: 12, padding: "14px 16px",
            borderRadius: 8,
            background: `${method.accentColor}0c`,
            border: `1px solid ${method.accentColor}30`,
            marginBottom: 24,
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
            <div>
              <div style={{ fontSize: 9, color: method.accentColor, letterSpacing: 3, marginBottom: 4 }}>TIP</div>
              <div style={{ fontSize: 12, color: "#8aaacb", lineHeight: 1.7 }}>{step.tip}</div>
            </div>
          </div>

          {/* nav */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => {
              if (activeStep > 0) { setActiveStep(activeStep - 1); }
              else if (activeMethod > 0) { setActiveMethod(activeMethod - 1); setActiveStep(METHODS[activeMethod - 1].steps.length - 1); }
            }}
              disabled={activeMethod === 0 && activeStep === 0}
              style={{
                padding: "9px 18px", borderRadius: 8,
                border: "1px solid #0f1e33", background: "transparent",
                color: "#334866", cursor: "pointer",
                fontFamily: "inherit", fontSize: 12,
                opacity: (activeMethod === 0 && activeStep === 0) ? 0.3 : 1,
              }}>← 前へ</button>

            <button onClick={() => {
              toggle(stepKey);
              if (activeStep < method.steps.length - 1) { setActiveStep(activeStep + 1); }
              else if (activeMethod < METHODS.length - 1) { setActiveMethod(activeMethod + 1); setActiveStep(0); }
            }}
              disabled={activeMethod === METHODS.length - 1 && activeStep === method.steps.length - 1}
              style={{
                padding: "9px 18px", borderRadius: 8,
                border: `1px solid ${method.accentColor}`,
                background: `${method.accentColor}14`,
                color: method.accentColor, cursor: "pointer",
                fontFamily: "inherit", fontSize: 12,
                boxShadow: `0 0 10px ${method.glowColor}`,
                opacity: (activeMethod === METHODS.length - 1 && activeStep === method.steps.length - 1) ? 0.3 : 1,
              }}>完了して次へ →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
