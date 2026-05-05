import { useState } from "react";

const curriculum = [
  {
    id: 1,
    phase: "基礎理解",
    color: "#00D4FF",
    icon: "⚡",
    duration: "60分",
    modules: [
      {
        title: "スポットインスタンスとは",
        time: "20分",
        type: "講義",
        content: [
          "オンデマンドとスポットの価格差（最大90%OFF）",
          "スポットプールとキャパシティの仕組み",
          "中断通知（2分前警告）のメカニズム",
          "適したワークロード vs 不向きなワークロード",
        ],
        lab: null,
        tip: "EC2コンソールで現在のスポット価格履歴を確認してみよう",
      },
      {
        title: "スポット価格の確認と分析",
        time: "20分",
        type: "ハンズオン",
        content: [
          "AWS コンソールでスポット価格履歴を確認",
          "複数AZの価格比較",
          "インスタンスタイプ別の価格変動パターン",
        ],
        lab: {
          cmd: `aws ec2 describe-spot-price-history \\
  --instance-types m5.xlarge c5.large \\
  --product-descriptions "Linux/UNIX" \\
  --start-time $(date -u +%Y-%m-%dT%H:%M:%S) \\
  --query 'SpotPriceHistory[*].{Type:InstanceType,AZ:AvailabilityZone,Price:SpotPrice}' \\
  --output table`,
          description: "CLIでスポット価格を取得・比較する",
        },
        tip: "c5系とm5系を比較すると、AZによって有利なインスタンスが異なることがわかる",
      },
      {
        title: "インスタンスタイプの選定戦略",
        time: "20分",
        type: "演習",
        content: [
          "Spot Instance Advisorの活用",
          "中断率の低いインスタンスタイプの見分け方",
          "フリートダイバーシティの概念",
          "vCPU/メモリ比率での代替候補リストアップ",
        ],
        lab: null,
        tip: "中断率は「<5%」のインスタンスを優先的に選ぶのがベストプラクティス",
      },
    ],
  },
  {
    id: 2,
    phase: "リクエストと起動",
    color: "#FF6B35",
    icon: "🚀",
    duration: "90分",
    modules: [
      {
        title: "スポットインスタンスリクエスト",
        time: "30分",
        type: "ハンズオン",
        content: [
          "一時的リクエスト vs 永続的リクエスト",
          "最大価格の設定（推奨：オンデマンド価格）",
          "リクエストの状態遷移を理解する",
          "コンソール・CLI・SDKでの起動方法",
        ],
        lab: {
          cmd: `aws ec2 request-spot-instances \\
  --spot-price "0.05" \\
  --instance-count 1 \\
  --type "one-time" \\
  --launch-specification '{
    "ImageId": "ami-xxxxxxxxx",
    "InstanceType": "m5.large",
    "KeyName": "my-key-pair",
    "SecurityGroupIds": ["sg-xxxxxxxx"],
    "SubnetId": "subnet-xxxxxxxx"
  }'`,
          description: "CLIでスポットインスタンスをリクエスト",
        },
        tip: "最大価格は省略（オンデマンド価格が自動適用）推奨。入札戦争は不要",
      },
      {
        title: "EC2フリートとスポットフリート",
        time: "30分",
        type: "ハンズオン",
        content: [
          "EC2フリート vs スポットフリートの違い",
          "allocation-strategy の選択",
          "capacity-optimized（推奨）",
          "lowest-price と price-capacity-optimized",
          "複数インスタンスタイプ・複数AZの設定",
        ],
        lab: {
          cmd: `# fleet-config.json
{
  "SpotOptions": {
    "AllocationStrategy": "capacity-optimized",
    "InstanceInterruptionBehavior": "terminate"
  },
  "LaunchTemplateConfigs": [
    {
      "LaunchTemplateSpecification": {
        "LaunchTemplateId": "lt-xxxxxxxxx",
        "Version": "$Latest"
      },
      "Overrides": [
        {"InstanceType": "m5.large", "SubnetId": "subnet-az1"},
        {"InstanceType": "m4.large", "SubnetId": "subnet-az1"},
        {"InstanceType": "m5.large", "SubnetId": "subnet-az2"},
        {"InstanceType": "c5.large", "SubnetId": "subnet-az2"}
      ]
    }
  ],
  "TargetCapacitySpecification": {
    "TotalTargetCapacity": 4,
    "OnDemandTargetCapacity": 1,
    "DefaultTargetCapacityType": "spot"
  }
}`,
          description: "EC2フリートでマルチAZ・マルチタイプ構成",
        },
        tip: "capacity-optimizedは中断リスクを大幅に下げるAWS推奨戦略",
      },
      {
        title: "起動テンプレートの作成",
        time: "30分",
        type: "ハンズオン",
        content: [
          "Launch Templateの作成と管理",
          "ユーザーデータでの初期設定自動化",
          "IAMロールの付与",
          "タグ付け戦略（コスト配分タグ）",
        ],
        lab: {
          cmd: `#!/bin/bash
# User Dataスクリプト例
yum update -y
yum install -y aws-cli

# スポット中断シグナルのハンドラー設定
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" \\
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")

while true; do
  INTERRUPT=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \\
    http://169.254.169.254/latest/meta-data/spot/termination-time)
  if [ "$INTERRUPT" != "" ]; then
    echo "Spot interruption detected! Saving state..."
    # グレースフルシャットダウン処理をここに記述
    aws s3 sync /var/data/ s3://my-bucket/checkpoint/
    break
  fi
  sleep 5
done &`,
          description: "中断通知を検知してデータを保存するスクリプト",
        },
        tip: "中断通知検知は必須実装。2分間でチェックポイント保存を完了させる設計に",
      },
    ],
  },
  {
    id: 3,
    phase: "Auto Scalingとの統合",
    color: "#7C4DFF",
    icon: "📈",
    duration: "90分",
    modules: [
      {
        title: "Auto Scaling グループの設定",
        time: "30分",
        type: "ハンズオン",
        content: [
          "混合インスタンスポリシーの設定",
          "オンデマンドベースとスポット比率の決定",
          "ウォームプールによる起動時間短縮",
          "スケーリングポリシーの設計",
        ],
        lab: {
          cmd: `aws autoscaling create-auto-scaling-group \\
  --auto-scaling-group-name my-mixed-asg \\
  --min-size 2 --max-size 10 --desired-capacity 4 \\
  --mixed-instances-policy '{
    "LaunchTemplate": {
      "LaunchTemplateSpecification": {
        "LaunchTemplateId": "lt-xxxxxxxxx",
        "Version": "$Latest"
      },
      "Overrides": [
        {"InstanceType": "m5.large"},
        {"InstanceType": "m4.large"},
        {"InstanceType": "c5.large"},
        {"InstanceType": "c4.large"}
      ]
    },
    "InstancesDistribution": {
      "OnDemandBaseCapacity": 1,
      "OnDemandPercentageAboveBaseCapacity": 20,
      "SpotAllocationStrategy": "capacity-optimized"
    }
  }' \\
  --vpc-zone-identifier "subnet-az1,subnet-az2,subnet-az3"`,
          description: "オンデマンド20%+スポット80%の混合ASG作成",
        },
        tip: "OnDemandBaseCapacityで最低限の安定性を確保しつつ、コスト削減",
      },
      {
        title: "インスタンスの重み付け設定",
        time: "30分",
        type: "演習",
        content: [
          "InstanceWeightingの概念と計算方法",
          "異なるスペックを正規化する方法",
          "コスト効率に基づく重み設定",
          "キャパシティ計算の実践",
        ],
        lab: {
          cmd: `# Overridesに重みを設定
"Overrides": [
  {
    "InstanceType": "m5.xlarge",
    "WeightedCapacity": "4"   # 4vCPU → weight 4
  },
  {
    "InstanceType": "m5.large", 
    "WeightedCapacity": "2"   # 2vCPU → weight 2
  },
  {
    "InstanceType": "c5.2xlarge",
    "WeightedCapacity": "8"   # 8vCPU → weight 8
  }
]
# TargetCapacity: 8 = 2×m5.xlarge or 4×m5.large`,
          description: "vCPU数に基づいた重み付けでキャパシティを均一化",
        },
        tip: "重み付けにより異なるインスタンスタイプを「8 vCPU」などで統一管理できる",
      },
      {
        title: "Capacity Rebalancingの設定",
        time: "30分",
        type: "ハンズオン",
        content: [
          "Capacity Rebalancingとは（EC2 Rebalance推奨シグナル）",
          "ASGでの自動置換設定",
          "プロアクティブな入れ替えで中断を最小化",
          "CloudWatchでのモニタリング",
        ],
        lab: {
          cmd: `# Capacity Rebalancingを有効化
aws autoscaling put-scaling-policy \\
  --auto-scaling-group-name my-mixed-asg \\
  --capacity-rebalance

# EC2 Rebalance推奨シグナルのCloudWatchアラーム
aws cloudwatch put-metric-alarm \\
  --alarm-name "SpotRebalanceWarning" \\
  --metric-name "EC2SpotRebalanceRecommendation" \\
  --namespace "AWS/EC2" \\
  --statistic Sum \\
  --period 60 \\
  --threshold 1 \\
  --comparison-operator GreaterThanOrEqualToThreshold \\
  --alarm-actions "arn:aws:sns:..."`,
          description: "Capacity RebalancingとCloudWatchアラームの設定",
        },
        tip: "中断2分前より早くRebalanceシグナルが来る。これを活用して余裕を持って置換",
      },
    ],
  },
  {
    id: 4,
    phase: "実践アーキテクチャ",
    color: "#00BFA5",
    icon: "🏗️",
    duration: "120分",
    modules: [
      {
        title: "Webアプリケーション構成",
        time: "40分",
        type: "設計・実装",
        content: [
          "ALB + ASG(混合インスタンス)の構成",
          "スティッキーセッションの排除設計",
          "ヘルスチェックの最適化",
          "ブルーグリーンデプロイとの組み合わせ",
        ],
        lab: {
          cmd: `# ALBターゲットグループのヘルスチェック最適化
aws elbv2 create-target-group \\
  --name my-spot-targets \\
  --protocol HTTP \\
  --port 80 \\
  --vpc-id vpc-xxxxxxxxx \\
  --health-check-path /health \\
  --health-check-interval-seconds 10 \\
  --healthy-threshold-count 2 \\
  --unhealthy-threshold-count 2

# Connection drainingを短く設定（スポット中断時に素早くデタッチ）
aws elbv2 modify-target-group-attributes \\
  --target-group-arn arn:aws:elasticloadbalancing:... \\
  --attributes Key=deregistration_delay.timeout_seconds,Value=30`,
          description: "スポット対応のALB設定（高速ドレイン）",
        },
        tip: "deregistration_delay は30秒以下に。中断2分間の中でドレインが完了するように",
      },
      {
        title: "バッチ処理・データパイプライン",
        time: "40分",
        type: "設計・実装",
        content: [
          "SQS + スポットWorkerパターン",
          "チェックポイント設計（S3/DynamoDB）",
          "冪等性の確保",
          "AWS Batch with Spot",
          "Step Functions との統合",
        ],
        lab: {
          cmd: `# SQSキューからメッセージを取得して処理するWorker
import boto3, json, time

sqs = boto3.client('sqs')
s3 = boto3.client('s3')
QUEUE_URL = 'https://sqs.ap-northeast-1.amazonaws.com/...'

def check_spot_interruption():
    try:
        r = requests.get(
          'http://169.254.169.254/latest/meta-data/spot/termination-time',
          timeout=1)
        return r.status_code == 200
    except:
        return False

while True:
    if check_spot_interruption():
        print("Interruption! Returning messages to queue...")
        # 処理中メッセージの可視性タイムアウトを0に（キューへ戻す）
        sqs.change_message_visibility(
            QueueUrl=QUEUE_URL,
            ReceiptHandle=current_receipt_handle,
            VisibilityTimeout=0
        )
        break
    
    msgs = sqs.receive_message(QueueUrl=QUEUE_URL, MaxNumberOfMessages=1)
    # ... 処理 ...
    time.sleep(5)`,
          description: "SQS Workerパターン with 中断時の安全なメッセージ返却",
        },
        tip: "可視性タイムアウトを0にするとメッセージがキューに即座に戻り、別インスタンスが処理できる",
      },
      {
        title: "コスト最適化と監視",
        time: "40分",
        type: "運用設計",
        content: [
          "Cost ExplorerでSpotコスト分析",
          "Savings Planとの組み合わせ",
          "CloudWatch Dashboardの構築",
          "スポット中断レートの追跡",
          "コスト配分タグ戦略",
        ],
        lab: {
          cmd: `# CloudWatch Dashboardにスポット関連メトリクスを追加
aws cloudwatch put-dashboard --dashboard-name SpotMetrics \\
  --dashboard-body '{
    "widgets": [
      {
        "type": "metric",
        "properties": {
          "metrics": [
            ["AWS/EC2","SpotMaxPriceTooLow"],
            ["AWS/AutoScaling","GroupSpotInstances"],
            ["AWS/AutoScaling","GroupOnDemandInstances"]
          ],
          "period": 300,
          "title": "Spot Fleet Health"
        }
      }
    ]
  }'

# タグベースのコスト配分
aws ec2 create-tags \\
  --resources i-xxxxxxxxx \\
  --tags Key=CostCenter,Value=DataPipeline \\
         Key=Environment,Value=Production \\
         Key=InstanceType,Value=Spot`,
          description: "スポットインスタンスの可視化とコスト追跡",
        },
        tip: "GroupSpotInstancesとGroupOnDemandInstancesの比率をウォッチして健全性確認",
      },
    ],
  },
  {
    id: 5,
    phase: "トラブルシューティング",
    color: "#FF4081",
    icon: "🔧",
    duration: "60分",
    modules: [
      {
        title: "よくある問題と対処法",
        time: "20分",
        type: "演習",
        content: [
          "capacity-not-available エラーの対処",
          "price-too-low エラー（最大価格設定時）",
          "スポットリクエストの状態確認方法",
          "フリートの健全性チェック",
        ],
        lab: {
          cmd: `# スポットリクエストの状態確認
aws ec2 describe-spot-instance-requests \\
  --query 'SpotInstanceRequests[*].{
    ID:SpotInstanceRequestId,
    State:State,
    Status:Status.Code,
    Message:Status.Message
  }' --output table

# フリートのイベント履歴確認
aws ec2 describe-fleet-history \\
  --fleet-id fleet-xxxxxxxxx \\
  --start-time 2024-01-01T00:00:00Z \\
  --query 'HistoryRecords[?EventType==\`error\`]'`,
          description: "スポットリクエストのデバッグコマンド集",
        },
        tip: "capacity-not-available が続く場合は対象AZやインスタンスタイプを変更",
      },
      {
        title: "中断シミュレーションテスト",
        time: "20分",
        type: "ハンズオン",
        content: [
          "AWS FIS (Fault Injection Simulator) でのテスト",
          "スポット中断のシミュレーション",
          "アプリケーションの回復確認",
          "ログ分析とMTTR計測",
        ],
        lab: {
          cmd: `# AWS FIS実験テンプレート（スポット中断シミュレーション）
{
  "description": "Spot Interruption Test",
  "targets": {
    "SpotInstances": {
      "resourceType": "aws:ec2:spot-instance",
      "resourceTags": {
        "Environment": "Test"
      },
      "selectionMode": "COUNT(1)"
    }
  },
  "actions": {
    "InterruptSpot": {
      "actionId": "aws:ec2:send-spot-instance-interruptions",
      "parameters": {
        "durationBeforeInterruption": "PT2M"
      },
      "targets": {"SpotInstances": "SpotInstances"}
    }
  },
  "stopConditions": [
    {"source": "none"}
  ]
}`,
          description: "AWS FISでスポット中断をシミュレートして耐障害性を検証",
        },
        tip: "本番デプロイ前に必ずFISで中断テストを実施。2分間で何ができるか確認する",
      },
      {
        title: "ベストプラクティスレビューと卒業課題",
        time: "20分",
        type: "総合演習",
        content: [
          "Well-Architected Frameworkとの整合性確認",
          "コスト削減額の試算・レポート作成",
          "アーキテクチャ図の作成",
          "チーム向けドキュメント整備",
        ],
        lab: {
          cmd: `# 卒業課題: 以下の要件を満たすシステムを設計・実装せよ
#
# 要件:
# - Webフロントエンド: ALB + ASG (On-Demand 1台 + Spot 最大9台)
# - バッチ処理: SQS + Spot Workers (capacity-optimized)
# - 中断時: 処理中ジョブをS3にチェックポイント保存
# - 監視: CloudWatch Dashboard + SNS通知
# - コスト目標: オンデマンドのみ比で70%以上削減
#
# 評価基準:
# ✓ FISで中断シミュレーション → データロスなし
# ✓ ASGが自動でSpotを置換 → サービス継続
# ✓ コスト削減率の計算と報告`,
          description: "総合課題：スポットネイティブアーキテクチャの設計と実装",
        },
        tip: "70%コスト削減は十分達成可能。m5.large スポット価格はオンデマンドの約15〜30%",
      },
    ],
  },
];

const typeColors = {
  講義: { bg: "#1a2535", border: "#00D4FF", text: "#00D4FF" },
  ハンズオン: { bg: "#1a2520", border: "#00BFA5", text: "#00BFA5" },
  演習: { bg: "#2a1a35", border: "#7C4DFF", text: "#7C4DFF" },
  "設計・実装": { bg: "#2a1f15", border: "#FF6B35", text: "#FF6B35" },
  運用設計: { bg: "#1a2520", border: "#00BFA5", text: "#00BFA5" },
  総合演習: { bg: "#2a1525", border: "#FF4081", text: "#FF4081" },
};

export default function SpotCurriculum() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeModule, setActiveModule] = useState(0);
  const [showLab, setShowLab] = useState(false);
  const [completed, setCompleted] = useState(new Set());

  const phase = curriculum[activePhase];
  const module = phase.modules[activeModule];
  const totalModules = curriculum.reduce((a, p) => a + p.modules.length, 0);
  const completedCount = completed.size;

  const toggleComplete = (key) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const moduleKey = `${activePhase}-${activeModule}`;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0e1a",
      color: "#e0e8ff",
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0d1b2a 0%, #1a0a2e 100%)",
        borderBottom: "1px solid #1e3a5f",
        padding: "20px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>⚡</span>
          <div>
            <div style={{ fontSize: 11, color: "#4a9eff", letterSpacing: 3, textTransform: "uppercase" }}>
              AWS HANDS-ON CURRICULUM
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>
              Spot Instance マスターコース
            </div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>進捗</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: phase.color }}>
              {completedCount} / {totalModules}
            </div>
            <div style={{
              width: 120,
              height: 4,
              background: "#1a2535",
              borderRadius: 2,
              marginTop: 4,
              overflow: "hidden",
            }}>
              <div style={{
                width: `${(completedCount / totalModules) * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg, #00D4FF, #7C4DFF)",
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>
        </div>

        {/* Phase tabs */}
        <div style={{ display: "flex", gap: 6, marginTop: 16, overflowX: "auto", paddingBottom: 4 }}>
          {curriculum.map((p, i) => (
            <button
              key={i}
              onClick={() => { setActivePhase(i); setActiveModule(0); setShowLab(false); }}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: `1px solid ${activePhase === i ? p.color : "#1e3a5f"}`,
                background: activePhase === i ? `${p.color}20` : "transparent",
                color: activePhase === i ? p.color : "#4a6080",
                fontSize: 11,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              {p.icon} Phase {p.id}: {p.phase}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left sidebar - module list */}
        <div style={{
          width: 240,
          borderRight: "1px solid #1e3a5f",
          padding: "16px 12px",
          overflowY: "auto",
          background: "#080c18",
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 10, color: "#3a5070", letterSpacing: 2, marginBottom: 12, padding: "0 4px" }}>
            MODULES — {phase.duration}
          </div>
          {phase.modules.map((m, i) => {
            const key = `${activePhase}-${i}`;
            const isActive = i === activeModule;
            const isDone = completed.has(key);
            const tc = typeColors[m.type];
            return (
              <button
                key={i}
                onClick={() => { setActiveModule(i); setShowLab(false); }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "12px",
                  marginBottom: 6,
                  borderRadius: 8,
                  border: `1px solid ${isActive ? phase.color : "#1a2535"}`,
                  background: isActive ? `${phase.color}12` : "transparent",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{
                    fontSize: 9,
                    padding: "2px 6px",
                    borderRadius: 4,
                    border: `1px solid ${tc.border}`,
                    color: tc.text,
                    background: tc.bg,
                  }}>
                    {m.type}
                  </span>
                  {isDone && <span style={{ fontSize: 12 }}>✓</span>}
                </div>
                <div style={{
                  fontSize: 12,
                  color: isActive ? "#fff" : "#7a9ab8",
                  lineHeight: 1.4,
                  fontWeight: isActive ? 600 : 400,
                }}>
                  {m.title}
                </div>
                <div style={{ fontSize: 10, color: "#3a5070", marginTop: 4 }}>⏱ {m.time}</div>
              </button>
            );
          })}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {/* Module header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{
                  fontSize: 10,
                  padding: "3px 10px",
                  borderRadius: 20,
                  border: `1px solid ${typeColors[module.type].border}`,
                  color: typeColors[module.type].text,
                  background: typeColors[module.type].bg,
                }}>
                  {module.type}
                </span>
                <span style={{ fontSize: 11, color: "#3a5070" }}>⏱ {module.time}</span>
              </div>
              <h2 style={{ margin: 0, fontSize: 22, color: "#fff", letterSpacing: -0.5, fontFamily: "inherit" }}>
                {module.title}
              </h2>
            </div>
            <button
              onClick={() => toggleComplete(moduleKey)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: `1px solid ${completed.has(moduleKey) ? "#00BFA5" : "#1e3a5f"}`,
                background: completed.has(moduleKey) ? "#00BFA520" : "transparent",
                color: completed.has(moduleKey) ? "#00BFA5" : "#3a5070",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              {completed.has(moduleKey) ? "✓ 完了" : "完了にする"}
            </button>
          </div>

          {/* Learning content */}
          <div style={{
            background: "#0d1525",
            border: "1px solid #1e3a5f",
            borderRadius: 12,
            padding: "20px",
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 11, color: "#3a6090", letterSpacing: 2, marginBottom: 14 }}>
              LEARNING OBJECTIVES
            </div>
            {module.content.map((item, i) => (
              <div key={i} style={{
                display: "flex",
                gap: 12,
                padding: "10px 0",
                borderBottom: i < module.content.length - 1 ? "1px solid #1a2535" : "none",
              }}>
                <span style={{ color: phase.color, fontSize: 14, flexShrink: 0, marginTop: 1 }}>▸</span>
                <span style={{ fontSize: 13, color: "#c0d0e8", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div style={{
            background: `${phase.color}10`,
            border: `1px solid ${phase.color}40`,
            borderRadius: 8,
            padding: "14px 16px",
            marginBottom: 16,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
            <div>
              <div style={{ fontSize: 10, color: phase.color, letterSpacing: 2, marginBottom: 4 }}>TIP</div>
              <div style={{ fontSize: 13, color: "#c0d0e8", lineHeight: 1.6 }}>{module.tip}</div>
            </div>
          </div>

          {/* Lab section */}
          {module.lab && (
            <div style={{
              background: "#080c18",
              border: "1px solid #1e3a5f",
              borderRadius: 12,
              overflow: "hidden",
            }}>
              <button
                onClick={() => setShowLab(!showLab)}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  color: "#7a9ab8",
                  fontSize: 12,
                  borderBottom: showLab ? "1px solid #1e3a5f" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#00BFA5" }}>$</span>
                  <span>LAB: {module.lab.description}</span>
                </div>
                <span style={{ fontSize: 16, transform: showLab ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  ⌄
                </span>
              </button>
              {showLab && (
                <div style={{ padding: "16px 20px" }}>
                  <pre style={{
                    margin: 0,
                    fontSize: 11,
                    lineHeight: 1.7,
                    color: "#a0e8c0",
                    overflowX: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}>
                    {module.lab.cmd}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button
              onClick={() => {
                if (activeModule > 0) { setActiveModule(activeModule - 1); setShowLab(false); }
                else if (activePhase > 0) { setActivePhase(activePhase - 1); setActiveModule(curriculum[activePhase - 1].modules.length - 1); setShowLab(false); }
              }}
              disabled={activePhase === 0 && activeModule === 0}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "1px solid #1e3a5f",
                background: "transparent",
                color: "#4a6080",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "inherit",
                opacity: activePhase === 0 && activeModule === 0 ? 0.3 : 1,
              }}
            >
              ← 前へ
            </button>
            <button
              onClick={() => {
                toggleComplete(moduleKey);
                if (activeModule < phase.modules.length - 1) { setActiveModule(activeModule + 1); setShowLab(false); }
                else if (activePhase < curriculum.length - 1) { setActivePhase(activePhase + 1); setActiveModule(0); setShowLab(false); }
              }}
              disabled={activePhase === curriculum.length - 1 && activeModule === phase.modules.length - 1}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: `1px solid ${phase.color}`,
                background: `${phase.color}15`,
                color: phase.color,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "inherit",
                opacity: activePhase === curriculum.length - 1 && activeModule === phase.modules.length - 1 ? 0.3 : 1,
              }}
            >
              完了して次へ →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
