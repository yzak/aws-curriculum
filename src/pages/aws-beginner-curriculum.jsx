import { useState } from "react";

/* ─────────────────────────────────────────────
   アーキテクチャ図コンポーネント
───────────────────────────────────────────── */
function ArchDiagram({ currentStep }) {
  const done = (s) => currentStep > s;
  const active = (s) => currentStep === s;
  const col = (s) => active(s) ? "#f97316" : done(s) ? "#22c55e" : "#cbd5e1";
  const bg = (s) => active(s) ? "#fff7ed" : done(s) ? "#f0fdf4" : "#f8fafc";
  const border = (s) => active(s) ? "#f97316" : done(s) ? "#22c55e" : "#e2e8f0";

  return (
    <div style={{
      background: "#f0f9ff",
      border: "2px solid #bae6fd",
      borderRadius: 16,
      padding: "20px 16px",
      marginBottom: 20,
      fontFamily: "'Nunito', sans-serif",
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#0369a1", marginBottom: 14, textAlign: "center", letterSpacing: 1 }}>
        🗺️ 完成アーキテクチャ
      </div>

      {/* Internet */}
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ display: "inline-block", padding: "6px 18px", background: "#e0f2fe", border: "2px solid #7dd3fc", borderRadius: 20, fontSize: 12, color: "#0369a1", fontWeight: 700 }}>
          🌐 インターネット
        </div>
      </div>
      <div style={{ textAlign: "center", fontSize: 18, color: "#94a3b8", lineHeight: 1 }}>↕</div>

      {/* IGW */}
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{
          display: "inline-block", padding: "5px 14px",
          background: bg(1), border: `2px solid ${border(1)}`,
          borderRadius: 10, fontSize: 11, color: col(1), fontWeight: 700,
          transition: "all 0.4s",
        }}>
          {done(1) ? "✅" : active(1) ? "⚡" : "○"} インターネットゲートウェイ (IGW)
        </div>
      </div>
      <div style={{ textAlign: "center", fontSize: 18, color: "#94a3b8", lineHeight: 1 }}>↕</div>

      {/* VPC outer */}
      <div style={{
        border: `2px dashed ${done(0) ? "#22c55e" : active(0) ? "#f97316" : "#cbd5e1"}`,
        borderRadius: 14, padding: "10px 10px 14px",
        background: done(0) ? "#f0fdf4" : active(0) ? "#fff7ed" : "#f8fafc",
        transition: "all 0.4s",
        marginBottom: 4,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: done(0) ? "#16a34a" : active(0) ? "#ea580c" : "#94a3b8", marginBottom: 10, textAlign: "center" }}>
          {done(0) ? "✅" : active(0) ? "⚡" : "○"} VPC (10.0.0.0/16)
        </div>

        {/* Subnet */}
        <div style={{
          border: `2px solid ${done(2) ? "#22c55e" : active(2) ? "#f97316" : "#e2e8f0"}`,
          borderRadius: 10, padding: "8px 10px",
          background: done(2) ? "#f0fdf4" : active(2) ? "#fff7ed" : "#fff",
          transition: "all 0.4s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: done(2) ? "#16a34a" : active(2) ? "#ea580c" : "#94a3b8", marginBottom: 8, textAlign: "center" }}>
            {done(2) ? "✅" : active(2) ? "⚡" : "○"} パブリックサブネット (10.0.1.0/24)
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {/* SG */}
            <div style={{
              border: `2px solid ${done(3) ? "#22c55e" : active(3) ? "#f97316" : "#e2e8f0"}`,
              borderRadius: 8, padding: "6px 10px",
              background: done(3) ? "#f0fdf4" : active(3) ? "#fff7ed" : "#f8fafc",
              fontSize: 10, fontWeight: 700,
              color: done(3) ? "#16a34a" : active(3) ? "#ea580c" : "#94a3b8",
              transition: "all 0.4s", textAlign: "center",
            }}>
              {done(3) ? "✅" : active(3) ? "⚡" : "○"}<br />
              セキュリティ<br />グループ<br />
              <span style={{ fontWeight: 400, fontSize: 9 }}>HTTP:80<br />SSH:22</span>
            </div>

            {/* EC2 */}
            <div style={{
              border: `2px solid ${done(4) ? "#22c55e" : active(4) ? "#f97316" : "#e2e8f0"}`,
              borderRadius: 8, padding: "6px 10px",
              background: done(4) ? "#f0fdf4" : active(4) ? "#fff7ed" : "#f8fafc",
              fontSize: 10, fontWeight: 700,
              color: done(4) ? "#16a34a" : active(4) ? "#ea580c" : "#94a3b8",
              transition: "all 0.4s", textAlign: "center",
            }}>
              {done(4) ? "✅" : active(4) ? "⚡" : "○"}<br />
              EC2<br />(Amazon Linux)<br />
              <span style={{ fontWeight: 400, fontSize: 9 }}>+ Elastic IP</span>
            </div>

            {/* nginx */}
            <div style={{
              border: `2px solid ${done(5) ? "#22c55e" : active(5) ? "#f97316" : "#e2e8f0"}`,
              borderRadius: 8, padding: "6px 10px",
              background: done(5) ? "#f0fdf4" : active(5) ? "#fff7ed" : "#f8fafc",
              fontSize: 10, fontWeight: 700,
              color: done(5) ? "#16a34a" : active(5) ? "#ea580c" : "#94a3b8",
              transition: "all 0.4s", textAlign: "center",
            }}>
              {done(5) ? "✅" : active(5) ? "⚡" : "○"}<br />
              nginx<br />(Hello World)<br />
              <span style={{ fontWeight: 400, fontSize: 9 }}>port 80</span>
            </div>
          </div>
        </div>

        {/* Route Table */}
        <div style={{
          border: `2px solid ${done(2) ? "#22c55e" : active(2) ? "#f97316" : "#e2e8f0"}`,
          borderRadius: 8, padding: "5px 10px",
          background: done(2) ? "#f0fdf4" : "#fff",
          marginTop: 8, fontSize: 10, color: "#64748b", textAlign: "center",
          transition: "all 0.4s",
        }}>
          {done(2) ? "✅" : "○"} ルートテーブル: 0.0.0.0/0 → IGW
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   用語解説バッジ
───────────────────────────────────────────── */
function Term({ word, desc }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ display: "inline-block", position: "relative" }}>
      <span
        onClick={() => setOpen(!open)}
        style={{
          background: "#fef9c3", border: "1px solid #fde047",
          borderRadius: 4, padding: "1px 6px", fontSize: 12,
          color: "#854d0e", cursor: "pointer", fontWeight: 700,
        }}
      >{word} ❓</span>
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, zIndex: 100,
          background: "#1e293b", color: "#e2e8f0", borderRadius: 8,
          padding: "10px 14px", fontSize: 12, lineHeight: 1.6,
          width: 240, boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          marginTop: 4,
        }}>
          {desc}
          <div style={{ textAlign: "right", marginTop: 6 }}>
            <span onClick={() => setOpen(false)} style={{ fontSize: 10, color: "#94a3b8", cursor: "pointer" }}>閉じる ×</span>
          </div>
        </div>
      )}
    </span>
  );
}

/* ─────────────────────────────────────────────
   ステップデータ
───────────────────────────────────────────── */
const STEPS = [
  {
    id: 0,
    title: "VPCを作成する",
    emoji: "🏗️",
    color: "#6366f1",
    lightColor: "#eef2ff",
    borderColor: "#a5b4fc",
    duration: "5分",
    what: "VPC（Virtual Private Cloud）は、AWS上にあなただけの仮想ネットワーク空間を作る機能です。現実世界でいうと「会社のオフィスビルを建てる土地を確保する」イメージです。",
    terms: [
      { word: "VPC", desc: "Virtual Private Cloud。AWSの中に作る、あなた専用の仮想ネットワーク。外部と切り離された安全な空間です。" },
      { word: "CIDR", desc: "IPアドレスの範囲を表す記法。10.0.0.0/16は「10.0.0.0〜10.0.255.255」の約65,000個のIPアドレスを意味します。" },
    ],
    console: [
      "AWSコンソール上部の検索バーに「VPC」と入力",
      "「VPCを作成」ボタンをクリック",
      "「VPCのみ」を選択",
      "名前タグ: my-first-vpc",
      "IPv4 CIDRブロック: 10.0.0.0/16",
      "「VPCを作成」ボタンをクリック",
    ],
    code: `# CLIで作成する場合（コンソールの代わりに使えます）
aws ec2 create-vpc \\
  --cidr-block 10.0.0.0/16 \\
  --tag-specifications \\
    'ResourceType=vpc,Tags=[{Key=Name,Value=my-first-vpc}]'

# 作成されたVPC IDを確認
aws ec2 describe-vpcs \\
  --filters "Name=tag:Name,Values=my-first-vpc" \\
  --query 'Vpcs[0].VpcId' --output text
# → vpc-xxxxxxxxxxxxxxxxx`,
    check: "VPCダッシュボードに「my-first-vpc」が表示され、ステータスが「Available」になっていますか？",
    point: "CIDRの /16 はネットワークの広さを表します。/16 だと約65,000台のサーバーを収容できる大きさです。今回はそんなに使いませんが、後から変更できないので余裕を持って設定します。",
  },
  {
    id: 1,
    title: "インターネットゲートウェイを作成・アタッチする",
    emoji: "🚪",
    color: "#0ea5e9",
    lightColor: "#f0f9ff",
    borderColor: "#7dd3fc",
    duration: "5分",
    what: "インターネットゲートウェイ（IGW）は、VPCとインターネットをつなぐ「玄関ドア」です。これがないとVPC内のサーバーはインターネットと通信できません。",
    terms: [
      { word: "IGW", desc: "Internet Gateway。VPCをインターネットに接続するためのゲートウェイ。VPCには1つだけアタッチできます。" },
      { word: "アタッチ", desc: "IGWをVPCに「接続する」操作。作成しただけでは機能せず、必ずVPCへのアタッチが必要です。" },
    ],
    console: [
      "VPCダッシュボード左メニュー「インターネットゲートウェイ」をクリック",
      "「インターネットゲートウェイを作成」をクリック",
      "名前タグ: my-first-igw",
      "「インターネットゲートウェイを作成」をクリック",
      "作成後、画面上部の「アクション」→「VPCにアタッチ」",
      "先ほど作成した my-first-vpc を選択して「アタッチ」",
    ],
    code: `# IGWを作成
aws ec2 create-internet-gateway \\
  --tag-specifications \\
    'ResourceType=internet-gateway,Tags=[{Key=Name,Value=my-first-igw}]'
# → "InternetGatewayId": "igw-xxxxxxxxx"

# VPCにアタッチ
aws ec2 attach-internet-gateway \\
  --internet-gateway-id igw-xxxxxxxxx \\
  --vpc-id vpc-xxxxxxxxx`,
    check: "インターネットゲートウェイの「状態」が「Attached」になっていますか？",
    point: "IGWは「作成」と「アタッチ」の2ステップが必要です。作成しただけではDetached（切り離し）状態で機能しません。よくある初心者の詰まりポイントです！",
  },
  {
    id: 2,
    title: "サブネットとルートテーブルを設定する",
    emoji: "🗂️",
    color: "#10b981",
    lightColor: "#f0fdf4",
    borderColor: "#6ee7b7",
    duration: "10分",
    what: "サブネットはVPCをさらに細かく区切った「部屋」です。インターネットに直接つながる「パブリックサブネット」にEC2を置きます。ルートテーブルは「どの通信をどこに送るか」を決める道路案内板です。",
    terms: [
      { word: "サブネット", desc: "VPC内をさらに分割したネットワーク。パブリック（インターネットと繋がる）とプライベート（内部のみ）があります。" },
      { word: "ルートテーブル", desc: "ネットワークの経路表。「0.0.0.0/0（全インターネット）→IGW」というルールでインターネット通信を可能にします。" },
      { word: "AZ", desc: "Availability Zone（アベイラビリティゾーン）。AWSデータセンターの物理的な区画。ap-northeast-1a などで指定します。" },
    ],
    console: [
      "【サブネット作成】左メニュー「サブネット」→「サブネットを作成」",
      "VPC: my-first-vpc を選択",
      "サブネット名: my-public-subnet",
      "アベイラビリティゾーン: ap-northeast-1a（東京）",
      "IPv4 CIDRブロック: 10.0.1.0/24",
      "「サブネットを作成」をクリック",
      "【ルートテーブル】左メニュー「ルートテーブル」→「ルートテーブルを作成」",
      "名前: my-public-rtb、VPC: my-first-vpc を選択して作成",
      "作成したルートテーブルを選択→「ルート」タブ→「ルートを編集」",
      "「ルートを追加」: 送信先 0.0.0.0/0、ターゲット: my-first-igw",
      "「サブネットの関連付け」タブ→my-public-subnetを関連付け",
      "サブネットを選択し「パブリックIPv4アドレスの自動割り当て」を有効化",
    ],
    code: `# サブネット作成
aws ec2 create-subnet \\
  --vpc-id vpc-xxxxxxxxx \\
  --cidr-block 10.0.1.0/24 \\
  --availability-zone ap-northeast-1a \\
  --tag-specifications \\
    'ResourceType=subnet,Tags=[{Key=Name,Value=my-public-subnet}]'

# パブリックIPの自動割り当てを有効化
aws ec2 modify-subnet-attribute \\
  --subnet-id subnet-xxxxxxxxx \\
  --map-public-ip-on-launch

# ルートテーブル作成
aws ec2 create-route-table \\
  --vpc-id vpc-xxxxxxxxx \\
  --tag-specifications \\
    'ResourceType=route-table,Tags=[{Key=Name,Value=my-public-rtb}]'

# インターネット向けルートを追加（0.0.0.0/0 → IGW）
aws ec2 create-route \\
  --route-table-id rtb-xxxxxxxxx \\
  --destination-cidr-block 0.0.0.0/0 \\
  --gateway-id igw-xxxxxxxxx

# サブネットに関連付け
aws ec2 associate-route-table \\
  --route-table-id rtb-xxxxxxxxx \\
  --subnet-id subnet-xxxxxxxxx`,
    check: "ルートテーブルに「0.0.0.0/0 → igw-xxxxx」のルートが追加され、サブネットに関連付けられていますか？",
    point: "10.0.1.0/24 の「/24」は256個のIPアドレスの範囲。VPCの /16 より狭い部屋を切り出したイメージです。0.0.0.0/0 は「すべてのIPアドレス（= インターネット全体）」を意味します。",
  },
  {
    id: 3,
    title: "セキュリティグループを作成する",
    emoji: "🛡️",
    color: "#f59e0b",
    lightColor: "#fffbeb",
    borderColor: "#fcd34d",
    duration: "5分",
    what: "セキュリティグループはEC2への「ファイアウォール」です。どのポートへの通信を許可するかを設定します。nginxのWebサーバーにはHTTPの80番ポート、管理用にSSHの22番ポートを開けます。",
    terms: [
      { word: "セキュリティグループ", desc: "EC2に付けるファイアウォール。インバウンド（受信）とアウトバウンド（送信）のルールを設定できます。" },
      { word: "ポート番号", desc: "通信の種類を表す番号。HTTP=80番、HTTPS=443番、SSH=22番 が代表的です。" },
      { word: "インバウンド", desc: "外部からEC2への受信通信。許可しないとアクセスできません。" },
    ],
    console: [
      "左メニュー「セキュリティグループ」→「セキュリティグループを作成」",
      "名前: my-web-sg",
      "説明: Web server security group",
      "VPC: my-first-vpc を選択",
      "【インバウンドルールを追加】",
      "ルール1: タイプ「HTTP」、ソース「0.0.0.0/0」（誰でもWebアクセス可）",
      "ルール2: タイプ「SSH」、ソース「マイIP」（自分のIPのみSSH可）",
      "「セキュリティグループを作成」をクリック",
    ],
    code: `# セキュリティグループ作成
aws ec2 create-security-group \\
  --group-name my-web-sg \\
  --description "Web server security group" \\
  --vpc-id vpc-xxxxxxxxx

# HTTP（80番）を全世界から許可
aws ec2 authorize-security-group-ingress \\
  --group-id sg-xxxxxxxxx \\
  --protocol tcp --port 80 --cidr 0.0.0.0/0

# SSH（22番）を自分のIPのみ許可
# ※ 203.0.113.1 は例。実際は自分のIPに変更してください
# 自分のIPは https://checkip.amazonaws.com で確認できます
aws ec2 authorize-security-group-ingress \\
  --group-id sg-xxxxxxxxx \\
  --protocol tcp --port 22 --cidr 203.0.113.1/32`,
    check: "インバウンドルールにHTTP(80)とSSH(22)の2つのルールが表示されていますか？",
    point: "SSH（22番）のソースを「0.0.0.0/0（全世界）」にするのは危険です！必ず「マイIP」または自分の固定IPに限定しましょう。セキュリティの基本中の基本です。",
  },
  {
    id: 4,
    title: "EC2インスタンスを起動する",
    emoji: "🖥️",
    color: "#ec4899",
    lightColor: "#fdf2f8",
    borderColor: "#f9a8d4",
    duration: "10分",
    what: "いよいよサーバー（EC2インスタンス）を起動します！EC2はAWSが提供する仮想サーバーです。これまで作ったVPC・サブネット・セキュリティグループを組み合わせます。",
    terms: [
      { word: "EC2", desc: "Elastic Compute Cloud。AWSの仮想サーバーサービス。数分で世界中どこでもサーバーを起動できます。" },
      { word: "AMI", desc: "Amazon Machine Image。EC2のOSテンプレート。Amazon Linux 2023はAWS公式のLinuxディストリビューションです。" },
      { word: "インスタンスタイプ", desc: "サーバーのスペック（CPU・メモリの組み合わせ）。t2.microは無料枠で使える最小スペックです。" },
      { word: "キーペア", desc: "EC2にSSH接続するための公開鍵・秘密鍵のペア。秘密鍵（.pemファイル）は絶対に無くさないでください！" },
      { word: "Elastic IP", desc: "EC2に固定IPアドレスを割り当てる機能。通常のパブリックIPは再起動で変わりますが、Elastic IPは固定されます。" },
    ],
    console: [
      "AWSコンソール上部検索で「EC2」→「インスタンスを起動」",
      "名前: my-first-ec2",
      "AMI: 「Amazon Linux 2023 AMI」を選択（無料利用枠）",
      "インスタンスタイプ: t2.micro（無料利用枠）",
      "キーペア: 「新しいキーペアを作成」→名前: my-key-pair、RSA、.pem形式でダウンロード",
      "ネットワーク設定「編集」をクリック",
      "VPC: my-first-vpc、サブネット: my-public-subnet",
      "パブリックIPの自動割り当て: 有効化",
      "セキュリティグループ: 既存を選択→ my-web-sg",
      "「インスタンスを起動」をクリック",
      "【Elastic IP】EC2左メニュー「Elastic IP」→「Elastic IPアドレスを割り当て」",
      "割り当て後、「アクション」→「Elastic IPアドレスの関連付け」→my-first-ec2を選択",
    ],
    code: `# AMI IDを確認（Amazon Linux 2023）
aws ssm get-parameter \\
  --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 \\
  --query Parameter.Value --output text

# EC2インスタンスを起動
aws ec2 run-instances \\
  --image-id ami-xxxxxxxxx \\
  --instance-type t2.micro \\
  --key-name my-key-pair \\
  --subnet-id subnet-xxxxxxxxx \\
  --security-group-ids sg-xxxxxxxxx \\
  --associate-public-ip-address \\
  --tag-specifications \\
    'ResourceType=instance,Tags=[{Key=Name,Value=my-first-ec2}]'

# インスタンスの起動確認（running になるまで1〜2分）
aws ec2 describe-instances \\
  --filters "Name=tag:Name,Values=my-first-ec2" \\
  --query 'Reservations[0].Instances[0].{State:State.Name,IP:PublicIpAddress}'

# Elastic IPを割り当てる
aws ec2 allocate-address --domain vpc
# → "AllocationId": "eipalloc-xxxxxxxxx", "PublicIp": "xxx.xxx.xxx.xxx"

aws ec2 associate-address \\
  --instance-id i-xxxxxxxxx \\
  --allocation-id eipalloc-xxxxxxxxx`,
    check: "EC2インスタンスの状態が「実行中（running）」になり、Elastic IPが表示されていますか？",
    point: "ダウンロードしたキーペア（my-key-pair.pem）は安全な場所に保管してください。これを失うとEC2にSSH接続できなくなります。ダウンロードは作成時の1回のみです。",
  },
  {
    id: 5,
    title: "EC2にSSH接続してnginxを設定する",
    emoji: "🚀",
    color: "#22c55e",
    lightColor: "#f0fdf4",
    borderColor: "#86efac",
    duration: "10分",
    what: "EC2にSSHで接続してnginxをインストールし、「Hello World」を表示するWebページを設定します！これが完成すればブラウザからアクセスできるようになります。",
    terms: [
      { word: "SSH", desc: "Secure Shell。暗号化された安全な通信でリモートサーバーを操作するプロトコル。ターミナル（コマンドライン）から使います。" },
      { word: "nginx", desc: "高性能なWebサーバーソフトウェア（エヌジンエックスと読む）。静的ファイルの配信やリバースプロキシに広く使われます。" },
      { word: "sudo", desc: "Linuxで管理者権限でコマンドを実行するための接頭辞。ソフトウェアのインストール等に必要です。" },
    ],
    console: [
      "ターミナルを開いてダウンロードした.pemファイルがある場所に移動",
      "（Windowsの場合はWSL2またはTeraTerm/PuTTYを使用）",
    ],
    code: `# ① キーファイルの権限を設定（Mac/Linux）
chmod 400 ~/Downloads/my-key-pair.pem

# ② EC2にSSH接続
# xx.xx.xx.xx は Elastic IPアドレスに置き換えてください
ssh -i ~/Downloads/my-key-pair.pem ec2-user@xx.xx.xx.xx

# 接続できたら以下のコマンドをEC2の中で実行します

# ③ システムを最新化
sudo dnf update -y

# ④ nginxをインストール
sudo dnf install -y nginx

# ⑤ nginxを起動
sudo systemctl start nginx

# ⑥ OS再起動後も自動起動するよう設定
sudo systemctl enable nginx

# ⑦ 起動確認
sudo systemctl status nginx
# → "active (running)" と表示されればOK

# ⑧ Hello Worldページを作成！
sudo bash -c 'cat > /usr/share/nginx/html/index.html << '"'"'EOF'"'"'
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Hello World!</title>
  <style>
    body {
      font-family: sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 40px 60px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 { color: #1a1a2e; font-size: 3em; margin: 0 0 10px; }
    p { color: #555; font-size: 1.2em; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🎉 Hello World!</h1>
    <p>AWSでWebサーバーの構築に成功しました！</p>
  </div>
</body>
</html>
EOF'

# ⑨ 完成！ブラウザで確認
# http://xx.xx.xx.xx （Elastic IPアドレス）にアクセス`,
    check: "ブラウザで http://（Elastic IP） にアクセスして「Hello World!」ページが表示されましたか？🎉",
    point: "dnf は Amazon Linux 2023 のパッケージマネージャーです。Amazon Linux 2 を使っている場合は dnf の代わりに yum を使います。どちらもほぼ同じコマンドで動きます。",
  },
];

/* ─────────────────────────────────────────────
   メインコンポーネント
───────────────────────────────────────────── */
export default function BeginnerCurriculum() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [showCode, setShowCode] = useState(false);
  const [showArch, setShowArch] = useState(true);

  const step = STEPS[currentStep];
  const isCompleted = completed.has(currentStep);
  const totalDone = completed.size;

  const complete = () => {
    const next = new Set(completed);
    next.add(currentStep);
    setCompleted(next);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowCode(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'Nunito', 'Hiragino Kaku Gothic ProN', sans-serif",
    }}>
      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #1e1b4b 100%)",
        padding: "20px 24px",
        color: "white",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{
              fontSize: 32, width: 52, height: 52,
              background: "rgba(255,255,255,0.15)", borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>☁️</div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#93c5fd", textTransform: "uppercase", marginBottom: 2 }}>
                AWS BEGINNER HANDS-ON
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>
                VPC → EC2 → nginx Hello World
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                所要時間: 約45分 ・ 難易度: ⭐☆☆ 初心者向け
              </div>
            </div>

            {/* progress */}
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#93c5fd", marginBottom: 6 }}>
                {totalDone} / {STEPS.length} ステップ完了
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {STEPS.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => { setCurrentStep(i); setShowCode(false); }}
                    style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: completed.has(i) ? "#22c55e" : i === currentStep ? "white" : "rgba(255,255,255,0.15)",
                      color: completed.has(i) ? "white" : i === currentStep ? "#1e3a5f" : "rgba(255,255,255,0.4)",
                      fontSize: 11, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "all 0.3s",
                      border: i === currentStep ? "2px solid white" : "2px solid transparent",
                    }}
                  >
                    {completed.has(i) ? "✓" : i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>

          {/* ── LEFT: steps nav ── */}
          <div style={{ width: 200, flexShrink: 0 }}>
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => { setCurrentStep(i); setShowCode(false); }}
                style={{
                  width: "100%", textAlign: "left",
                  padding: "10px 12px", marginBottom: 6, borderRadius: 10,
                  border: `2px solid ${i === currentStep ? s.color : completed.has(i) ? "#22c55e" : "#e2e8f0"}`,
                  background: i === currentStep ? s.lightColor : completed.has(i) ? "#f0fdf4" : "white",
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{completed.has(i) ? "✅" : s.emoji}</span>
                  <div>
                    <div style={{
                      fontSize: 11, fontWeight: 700,
                      color: i === currentStep ? s.color : completed.has(i) ? "#16a34a" : "#475569",
                    }}>
                      Step {i + 1}
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.3 }}>{s.title}</div>
                  </div>
                </div>
              </button>
            ))}

            {/* arch toggle */}
            <button
              onClick={() => setShowArch(!showArch)}
              style={{
                width: "100%", marginTop: 8, padding: "8px 12px",
                borderRadius: 10, border: "2px solid #e2e8f0",
                background: showArch ? "#f0f9ff" : "white",
                color: "#0369a1", fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {showArch ? "🗺️ 図を隠す" : "🗺️ 構成図を見る"}
            </button>
          </div>

          {/* ── RIGHT: content ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* arch diagram */}
            {showArch && <ArchDiagram currentStep={currentStep} />}

            {/* step card */}
            <div style={{
              background: "white",
              border: `2px solid ${step.borderColor}`,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: `0 4px 20px ${step.borderColor}50`,
            }}>
              {/* card header */}
              <div style={{
                background: step.lightColor,
                padding: "16px 20px",
                borderBottom: `2px solid ${step.borderColor}`,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: step.color, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 24, flexShrink: 0,
                }}>
                  {step.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: step.color, fontWeight: 700, letterSpacing: 1 }}>
                    STEP {step.id + 1} / {STEPS.length}  ⏱ {step.duration}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b" }}>{step.title}</div>
                </div>
                {isCompleted && (
                  <div style={{
                    background: "#22c55e", color: "white",
                    borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700,
                  }}>✓ 完了</div>
                )}
              </div>

              <div style={{ padding: "20px" }}>
                {/* what */}
                <div style={{
                  background: step.lightColor, borderRadius: 10,
                  padding: "14px 16px", marginBottom: 16,
                  borderLeft: `4px solid ${step.color}`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: step.color, marginBottom: 6, letterSpacing: 1 }}>
                    📖 このステップでやること
                  </div>
                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{step.what}</div>
                </div>

                {/* terms */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 8, letterSpacing: 1 }}>
                    📚 用語をタップして確認
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {step.terms.map((t, i) => <Term key={i} word={t.word} desc={t.desc} />)}
                  </div>
                </div>

                {/* console steps */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#1e40af", marginBottom: 10, letterSpacing: 1 }}>
                    🖱️ コンソール操作手順
                  </div>
                  {step.console.map((c, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 10, padding: "8px 0",
                      borderBottom: i < step.console.length - 1 ? "1px solid #f1f5f9" : "none",
                      alignItems: "flex-start",
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%",
                        background: step.color, color: "white",
                        fontSize: 11, fontWeight: 700, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{i + 1}</div>
                      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{c}</div>
                    </div>
                  ))}
                </div>

                {/* code toggle */}
                <button
                  onClick={() => setShowCode(!showCode)}
                  style={{
                    width: "100%", padding: "10px",
                    borderRadius: 10, border: "2px solid #1e293b",
                    background: showCode ? "#1e293b" : "white",
                    color: showCode ? "white" : "#1e293b",
                    cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
                    marginBottom: showCode ? 0 : 16, transition: "all 0.2s",
                  }}
                >
                  {showCode ? "▲ CLIコマンドを隠す" : "▼ CLIコマンドも確認する"}
                </button>

                {showCode && (
                  <div style={{
                    background: "#0f172a", borderRadius: "0 0 10px 10px",
                    padding: "16px", marginBottom: 16, overflow: "auto",
                  }}>
                    <pre style={{
                      margin: 0, fontSize: 11, lineHeight: 1.8,
                      color: "#7dd3fc", whiteSpace: "pre-wrap", wordBreak: "break-word",
                    }}>{step.code}</pre>
                  </div>
                )}

                {/* check */}
                <div style={{
                  background: "#f0fdf4", border: "2px solid #86efac",
                  borderRadius: 10, padding: "14px 16px", marginBottom: 16,
                  display: "flex", gap: 10, alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>✅</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", marginBottom: 4 }}>確認チェック</div>
                    <div style={{ fontSize: 13, color: "#166534", lineHeight: 1.6 }}>{step.check}</div>
                  </div>
                </div>

                {/* point */}
                <div style={{
                  background: "#fffbeb", border: "2px solid #fcd34d",
                  borderRadius: 10, padding: "14px 16px", marginBottom: 20,
                  display: "flex", gap: 10, alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>ポイント</div>
                    <div style={{ fontSize: 13, color: "#78350f", lineHeight: 1.6 }}>{step.point}</div>
                  </div>
                </div>

                {/* nav buttons */}
                <div style={{ display: "flex", gap: 10 }}>
                  {currentStep > 0 && (
                    <button
                      onClick={() => { setCurrentStep(currentStep - 1); setShowCode(false); }}
                      style={{
                        padding: "12px 20px", borderRadius: 10,
                        border: "2px solid #e2e8f0", background: "white",
                        color: "#475569", cursor: "pointer",
                        fontFamily: "inherit", fontSize: 13, fontWeight: 700,
                      }}
                    >← 前のステップ</button>
                  )}
                  <button
                    onClick={complete}
                    disabled={currentStep === STEPS.length - 1 && isCompleted}
                    style={{
                      flex: 1, padding: "12px 20px", borderRadius: 10,
                      border: "none",
                      background: isCompleted
                        ? "linear-gradient(135deg,#22c55e,#16a34a)"
                        : `linear-gradient(135deg,${step.color},${step.color}cc)`,
                      color: "white", cursor: "pointer",
                      fontFamily: "inherit", fontSize: 14, fontWeight: 800,
                      boxShadow: `0 4px 14px ${step.color}50`,
                      transition: "all 0.2s",
                    }}
                  >
                    {currentStep === STEPS.length - 1
                      ? isCompleted ? "🎉 全ステップ完了！" : "✅ 完了！Hello Worldを確認した"
                      : isCompleted ? "次のステップへ →" : `✅ 完了！次へ進む →`}
                  </button>
                </div>

                {/* 最終完了メッセージ */}
                {currentStep === STEPS.length - 1 && isCompleted && (
                  <div style={{
                    marginTop: 20,
                    background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
                    border: "2px solid #22c55e",
                    borderRadius: 14, padding: "20px",
                    textAlign: "center",
                  }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#15803d", marginBottom: 8 }}>
                      おめでとうございます！
                    </div>
                    <div style={{ fontSize: 13, color: "#166534", lineHeight: 1.7 }}>
                      VPCの作成からnginxのHello World表示まで完成しました！<br />
                      次のステップとして、<strong>HTTPS化（ACM + ALB）</strong>や<br />
                      <strong>独自ドメイン設定（Route 53）</strong>に挑戦してみましょう 🚀
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
