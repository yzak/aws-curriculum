import { useState, useEffect } from "react";

/* ══════════════════════════════════════════════════════════════
   DATA — 6カテゴリ × 各テーマ
══════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  {
    id: "network",
    title: "ネットワーク基礎",
    emoji: "🌐",
    color: "#0ea5e9",
    dark: "#0369a1",
    light: "#f0f9ff",
    border: "#bae6fd",
    desc: "インターネット・通信の仕組みを理解する",
    analogy: "手紙や宅配便のしくみと同じです",
    terms: [
      {
        word: "IPアドレス",
        read: "アイピーアドレス",
        eng: "IP Address",
        level: 1,
        short: "インターネット上の「住所」",
        long: "すべての機器がインターネット上で持つ固有の番号。手紙の宛先と同じで、これがないとデータを届ける場所がわかりません。「192.168.1.1」のような数字の組み合わせです。",
        example: "あなたの自宅のWi-Fiルーターにも、インターネット側のIPアドレスが割り当てられています。",
        aws: "AWSではEC2インスタンスやALBにIPアドレスが割り当てられます。",
        analogy: "🏠 家の住所と同じ。住所がなければ手紙が届かない！",
        quiz: "IPアドレスはインターネット上の何に例えられますか？",
        quizAnswer: "住所",
        quizOptions: ["電話番号", "住所", "パスワード", "名前"],
      },
      {
        word: "ドメイン名",
        read: "ドメインめい",
        eng: "Domain Name",
        level: 1,
        short: "IPアドレスにつけた「名前」",
        long: "数字だけのIPアドレスは覚えにくいため、「google.com」や「amazon.co.jp」のような人間が覚えやすい名前をつけたものです。DNS（後述）が名前とIPアドレスを変換します。",
        example: "ブラウザで「amazon.co.jp」と入力すると、DNSがIPアドレスに変換してアクセスします。",
        aws: "Route 53がAWSのDNS・ドメイン管理サービスです。",
        analogy: "📞 電話帳のようなもの。「田中さん」→電話番号を調べるのと同じ仕組み",
        quiz: "「amazon.co.jp」のようなわかりやすい名前を何といいますか？",
        quizAnswer: "ドメイン名",
        quizOptions: ["IPアドレス", "ドメイン名", "パスワード", "URL"],
      },
      {
        word: "DNS",
        read: "ディーエヌエス",
        eng: "Domain Name System",
        level: 2,
        short: "ドメイン名をIPアドレスに変換する仕組み",
        long: "Domain Name Systemの略。「google.com → 142.250.xx.xx」のように、人間が読めるドメイン名をコンピュータが使うIPアドレスに変換する電話帳のようなシステムです。",
        example: "ブラウザに「google.com」と入力→DNSが「142.250.xx.xx」に変換→そのIPにアクセスという流れです。",
        aws: "Route 53がAWSのDNSサービス。CloudFrontやALBのドメイン設定に使います。",
        analogy: "📖 電話帳サービス。名前（ドメイン）から電話番号（IP）を調べてくれる",
        quiz: "DNSの役割は何ですか？",
        quizAnswer: "ドメイン名をIPアドレスに変換する",
        quizOptions: ["パスワードを管理する", "ドメイン名をIPアドレスに変換する", "データを暗号化する", "ファイルを保存する"],
      },
      {
        word: "HTTP / HTTPS",
        read: "エイチティーティーピー / エイチティーティーピーエス",
        eng: "HyperText Transfer Protocol (Secure)",
        level: 1,
        short: "Webページをやり取りするルール",
        long: "ブラウザとWebサーバーがデータを送受信するためのルール（プロトコル）です。HTTPSは通信が暗号化されていて安全。鍵マーク🔒がついているサイトがHTTPS対応です。",
        example: "「https://」から始まるURLは暗号化通信。パスワードやクレカ情報を安全に送れます。",
        aws: "CloudFrontやALBでHTTPSを設定。ACMで無料のSSL証明書を取得できます。",
        analogy: "HTTP=封筒なし（中身が見える）、HTTPS=封筒あり（中身が見えない）の手紙",
        quiz: "HTTPSの「S」は何を意味しますか？",
        quizAnswer: "Secure（安全・暗号化）",
        quizOptions: ["Speed（速さ）", "Secure（安全・暗号化）", "Server（サーバー）", "Simple（シンプル）"],
      },
      {
        word: "ポート番号",
        read: "ポートばんごう",
        eng: "Port Number",
        level: 2,
        short: "サービスを区別する「窓口番号」",
        long: "1台のサーバーで複数のサービスを動かすために使う番号。HTTP=80番、HTTPS=443番、SSH=22番など決まった番号があります。マンションの部屋番号のようなものです。",
        example: "AWSのセキュリティグループで「80番ポートを開放」すると、外部からWebアクセスが可能になります。",
        aws: "セキュリティグループのインバウンドルールでポート番号を指定してアクセス制御します。",
        analogy: "🏢 マンションの部屋番号。建物（IPアドレス）の中のどの部屋（サービス）に届けるか",
        quiz: "HTTPSが使うポート番号はどれですか？",
        quizAnswer: "443番",
        quizOptions: ["80番", "22番", "443番", "3306番"],
      },
      {
        word: "ファイアウォール",
        read: "ファイアウォール",
        eng: "Firewall",
        level: 2,
        short: "不正な通信をブロックする「門番」",
        long: "ネットワークの出入口で、許可された通信だけを通し、不正な通信をブロックする仕組みです。火事の延焼を防ぐ「防火壁」が語源です。",
        example: "AWSのセキュリティグループはEC2インスタンスのファイアウォール機能を担っています。",
        aws: "Security GroupとNetwork ACL（NACL）がAWSのファイアウォール機能です。",
        analogy: "🚨 建物の入口にいる警備員。通行許可証（ルール）がある人だけ通す",
        quiz: "ファイアウォールの役割は何ですか？",
        quizAnswer: "不正な通信をブロックする",
        quizOptions: ["データを保存する", "不正な通信をブロックする", "通信を高速化する", "ファイルを変換する"],
      },
      {
        word: "VPN",
        read: "ブイピーエン",
        eng: "Virtual Private Network",
        level: 2,
        short: "インターネット上に作る「専用トンネル」",
        long: "公共のインターネット上に暗号化された専用トンネルを作り、安全に通信する技術です。在宅勤務時に社内ネットワークに安全に接続する際によく使われます。",
        example: "自宅から会社のシステムにアクセスするとき、VPNを使うと社内にいるのと同じ環境になります。",
        aws: "AWS VPN・AWS Direct Connectがオンプレミスとの安全な接続を提供します。",
        analogy: "🚇 地下に掘られた専用トンネル。外から見えない安全な通路",
        quiz: "VPNを使う主な目的は何ですか？",
        quizAnswer: "インターネット上に安全なトンネルを作って通信する",
        quizOptions: ["通信を高速化する", "インターネット上に安全なトンネルを作って通信する", "IPアドレスを取得する", "DNSを設定する"],
      },
      {
        word: "帯域幅（バンド幅）",
        read: "たいいきはば",
        eng: "Bandwidth",
        level: 2,
        short: "データを運べる「道路の広さ」",
        long: "一定時間に転送できるデータ量の最大値。単位はbps（ビット毎秒）、Mbps、Gbpsなど。帯域幅が広いほど大量データを素早く転送できます。",
        example: "光回線（1Gbps）はADSL（50Mbps）より約20倍多くのデータを同時に転送できます。",
        aws: "AWSのEC2インスタンスタイプによってネットワーク帯域幅が異なります。",
        analogy: "🛣️ 道路の車線数。車線（帯域）が多いほど、同時に多くの車（データ）が走れる",
        quiz: "帯域幅が大きいと何が変わりますか？",
        quizAnswer: "より多くのデータを速く転送できる",
        quizOptions: ["ストレージが増える", "セキュリティが上がる", "より多くのデータを速く転送できる", "CPUが速くなる"],
      },
    ],
  },
  {
    id: "server",
    title: "サーバー・コンピュータ",
    emoji: "🖥️",
    color: "#8b5cf6",
    dark: "#6d28d9",
    light: "#f5f3ff",
    border: "#ddd6fe",
    desc: "サーバーとコンピュータの基本概念を理解する",
    analogy: "レストランのキッチン（厨房）のようなもの",
    terms: [
      {
        word: "サーバー",
        read: "サーバー",
        eng: "Server",
        level: 1,
        short: "他のコンピュータにサービスを提供するコンピュータ",
        long: "ウェブサイトのデータを保管・配信したり、メールを管理したりする専用のコンピュータです。24時間365日稼働し続けることが多いです。「サービスを提供する者」という意味です。",
        example: "あなたがAmazonのサイトを見るとき、Amazonのサーバーからデータが送られてきます。",
        aws: "EC2（Elastic Compute Cloud）がAWSの仮想サーバーサービスです。",
        analogy: "🍳 レストランのキッチン。お客さん（クライアント）の注文に応じて料理（データ）を提供する",
        quiz: "サーバーとは何ですか？",
        quizAnswer: "他のコンピュータにサービスを提供するコンピュータ",
        quizOptions: ["データを保存するUSBメモリ", "他のコンピュータにサービスを提供するコンピュータ", "インターネットに接続する機器", "画面を表示するモニター"],
      },
      {
        word: "クライアント",
        read: "クライアント",
        eng: "Client",
        level: 1,
        short: "サーバーにサービスを要求する側",
        long: "サーバーに対してデータやサービスを「要求（リクエスト）」する側。あなたのPCやスマホがクライアントにあたります。サーバーとクライアントで役割を分担しています。",
        example: "スマホでYouTubeを見るとき、スマホ（クライアント）がYouTubeのサーバーに動画を要求しています。",
        aws: "CLIを使ってAWSを操作するとき、あなたのPCがクライアントです。",
        analogy: "🛎️ レストランのお客さん。注文（リクエスト）してキッチン（サーバー）から料理（レスポンス）をもらう",
        quiz: "クライアント・サーバーモデルでスマホはどちらになりますか？",
        quizAnswer: "クライアント",
        quizOptions: ["サーバー", "クライアント", "ルーター", "DNS"],
      },
      {
        word: "CPU",
        read: "シーピーユー",
        eng: "Central Processing Unit",
        level: 1,
        short: "コンピュータの「頭脳・計算担当」",
        long: "中央処理装置。コンピュータの全ての計算・処理を行う中心的なパーツです。コア数が多いほど、同時に複数の処理ができます。単位はGHz（ギガヘルツ）やコア数で表します。",
        example: "動画編集や機械学習など重い処理はCPUをフル活用します。AWSのEC2はvCPU数でスペックを選びます。",
        aws: "EC2のインスタンスタイプ（t2.micro=1vCPU、c5.4xlarge=16vCPUなど）でCPUを選択します。",
        analogy: "🧠 人間の脳。すべての判断・計算を行う指令塔",
        quiz: "CPUの役割は何ですか？",
        quizAnswer: "コンピュータの計算・処理を行う",
        quizOptions: ["データを長期保存する", "コンピュータの計算・処理を行う", "画面に映像を出す", "インターネットに接続する"],
      },
      {
        word: "メモリ（RAM）",
        read: "メモリ（ラム）",
        eng: "Memory / RAM",
        level: 1,
        short: "作業中データを一時的に置く「作業台」",
        long: "Random Access Memory。プログラムの実行中に使うデータを一時的に保存する場所。作業机のようなもので、電源を切ると消えます。多いほど多くのアプリを同時に動かせます。",
        example: "Chromeのタブを100個開くとメモリ不足になりパソコンが遅くなります。",
        aws: "EC2インスタンスのメモリ量はインスタンスタイプで決まります（例: t2.micro=1GB）。",
        analogy: "📋 仕事の作業台。広い（大きいメモリ）ほど、同時に広げられる書類が多い",
        quiz: "メモリ（RAM）の特徴はどれですか？",
        quizAnswer: "電源を切るとデータが消える一時的な記憶領域",
        quizOptions: ["電源を切ってもデータが残る", "電源を切るとデータが消える一時的な記憶領域", "インターネットに接続する", "画像を処理する"],
      },
      {
        word: "ストレージ（HDD/SSD）",
        read: "ストレージ",
        eng: "Storage / HDD / SSD",
        level: 1,
        short: "データを永続的に保存する「倉庫」",
        long: "電源を切ってもデータが消えない永続的な記憶装置。HDD（ハードディスク）は大容量・安価、SSD（ソリッドステートドライブ）は高速・高価。OSやアプリ・ファイルを保存します。",
        example: "AWSのEC2にはEBS（Elastic Block Store）というストレージを接続します。",
        aws: "EBS（SSD/HDD）、S3（オブジェクトストレージ）、EFS（ファイルストレージ）などが対応します。",
        analogy: "🏪 倉庫・本棚。電源を切ってもデータは消えない永続的な保管場所",
        quiz: "SSDとHDDの違いは何ですか？",
        quizAnswer: "SSDの方が高速だが高価",
        quizOptions: ["HDDの方が速い", "SSDは容量が無制限", "SSDの方が高速だが高価", "HDDはデータが消えやすい"],
      },
      {
        word: "仮想化",
        read: "かそうか",
        eng: "Virtualization",
        level: 2,
        short: "1台の物理マシンを複数台に見せる技術",
        long: "物理的なサーバー1台の上に、ソフトウェアで複数の「仮想的なサーバー」を作る技術です。AWSクラウドはこの仮想化技術の上に成り立っています。",
        example: "AWSのEC2インスタンスを10台起動しても、実際の物理サーバーは1台かもしれません。",
        aws: "EC2は仮想化技術で動いています。Hypervisor（ハイパーバイザー）が物理リソースを分割します。",
        analogy: "🏢 1棟のビルを仕切りで複数の部屋（仮想サーバー）に分けるイメージ",
        quiz: "仮想化の説明として正しいものはどれですか？",
        quizAnswer: "1台の物理マシン上に複数の仮想マシンを作る技術",
        quizOptions: ["複数の物理マシンを1台に合体させる技術", "1台の物理マシン上に複数の仮想マシンを作る技術", "インターネットを高速化する技術", "データを暗号化する技術"],
      },
      {
        word: "コンテナ",
        read: "コンテナ",
        eng: "Container",
        level: 3,
        short: "アプリを独立して動かす「軽量な箱」",
        long: "アプリケーションとその実行に必要なものをまとめてパッケージ化した軽量な実行環境。仮想化より軽量で起動が速い。Dockerが代表的なコンテナ技術です。",
        example: "「自分のPCでは動くのに本番サーバーで動かない」問題をコンテナが解決します。",
        aws: "ECS/EKSがAWSのコンテナ管理サービス。Fargateでサーバー管理不要でコンテナを実行できます。",
        analogy: "📦 輸送コンテナ。中身（アプリ）ごとどこ（どんなサーバー）でも同じように動く",
        quiz: "コンテナを使う主なメリットはどれですか？",
        quizAnswer: "どの環境でも同じように動く",
        quizOptions: ["ストレージが無制限になる", "どの環境でも同じように動く", "インターネットが速くなる", "CPUが不要になる"],
      },
      {
        word: "OSI参照モデル（概要）",
        read: "オーエスアイさんしょうモデル",
        eng: "OSI Reference Model",
        level: 3,
        short: "通信の仕組みを7層に整理したモデル",
        long: "ネットワーク通信の機能を7つの層（レイヤー）に分けて整理したモデル。CLF試験ではL4（トランスポート）とL7（アプリケーション）が重要です。ALBはL7、NLBはL4で動作します。",
        example: "AWSのALB（Application Load Balancer）はL7（HTTP/HTTPS）レベルで動作します。",
        aws: "ALB=L7（HTTPヘッダー・パスでルーティング）、NLB=L4（TCP/UDPでルーティング）",
        analogy: "📬 手紙の配送プロセスを「書く→封筒→住所→集配→輸送→配達→受取」の7段階に分けたイメージ",
        quiz: "AWSのALBは何レイヤーで動作しますか？",
        quizAnswer: "L7（アプリケーション層）",
        quizOptions: ["L3（ネットワーク層）", "L4（トランスポート層）", "L7（アプリケーション層）", "L1（物理層）"],
      },
    ],
  },
  {
    id: "security",
    title: "セキュリティ・認証",
    emoji: "🔒",
    color: "#ef4444",
    dark: "#b91c1c",
    light: "#fef2f2",
    border: "#fecaca",
    desc: "認証・暗号化・セキュリティの基本を理解する",
    analogy: "鍵・金庫・警備員のようなもの",
    terms: [
      {
        word: "認証（Authentication）",
        read: "にんしょう",
        eng: "Authentication",
        level: 1,
        short: "「本人かどうか」を確認すること",
        long: "「あなたは誰ですか？」を確認するプロセス。パスワード・指紋・顔認証などが認証の方法です。英語でAuthentication、略してAuthnと書くこともあります。",
        example: "AWSコンソールへのログインは認証です。IDとパスワードで「本人確認」をしています。",
        aws: "IAMユーザーのパスワード・アクセスキー・MFAが認証の仕組みです。",
        analogy: "🪪 入館時のID確認。「あなたは誰ですか？」を確認する作業",
        quiz: "認証（Authentication）とは何ですか？",
        quizAnswer: "本人かどうかを確認すること",
        quizOptions: ["アクセス権限を管理すること", "本人かどうかを確認すること", "データを暗号化すること", "パスワードを保存すること"],
      },
      {
        word: "認可（Authorization）",
        read: "にんか",
        eng: "Authorization",
        level: 2,
        short: "「何をしていいか」を決めること",
        long: "認証で本人確認した後、「その人が何をしてよいか」を決めるプロセス。管理者は全操作OK、一般ユーザーは閲覧のみ、など権限を制御します。略してAuthzと書くこともあります。",
        example: "AWSのIAMポリシーで「S3の読み取りは許可、削除は禁止」と設定するのが認可です。",
        aws: "IAMポリシー・IAMロールが認可の仕組みです。",
        analogy: "🔑 入館後の行動ルール。「受付フロアはOK、サーバー室はNG」のように行動範囲を決める",
        quiz: "認可（Authorization）とは何ですか？",
        quizAnswer: "本人に何を許可するかを決めること",
        quizOptions: ["本人かどうかを確認すること", "本人に何を許可するかを決めること", "通信を暗号化すること", "パスワードを変更すること"],
      },
      {
        word: "MFA（多要素認証）",
        read: "エムエフエー",
        eng: "Multi-Factor Authentication",
        level: 1,
        short: "パスワード＋もう1つで認証を強化する",
        long: "「知っているもの（パスワード）」+「持っているもの（スマホアプリ）」など、複数の要素を組み合わせて認証します。パスワードが漏れても不正ログインを防げます。",
        example: "AWSのルートアカウントには必ずMFAを設定。Google AuthenticatorやAuthyで6桁のコードを使います。",
        aws: "IAMユーザーとルートアカウントにMFAを設定することがAWSのセキュリティベストプラクティスです。",
        analogy: "🏦 銀行のATM。「キャッシュカード（持っているもの）+暗証番号（知っているもの）」の2段階",
        quiz: "MFAが「多要素」認証と呼ばれる理由は何ですか？",
        quizAnswer: "複数の異なる要素を組み合わせて認証するから",
        quizOptions: ["認証が多段階あるから", "複数の異なる要素を組み合わせて認証するから", "多くのユーザーが使えるから", "パスワードが多く必要だから"],
      },
      {
        word: "暗号化",
        read: "あんごうか",
        eng: "Encryption",
        level: 1,
        short: "データを読めない形に変換して守る技術",
        long: "データを特定の鍵を持つ人しか読めない形式に変換する技術です。「保存時の暗号化（at rest）」と「転送時の暗号化（in transit）」の2種類があります。",
        example: "AWSのS3バケットで「サーバーサイド暗号化」を有効にすると、データが自動で暗号化されます。",
        aws: "KMS（Key Management Service）がAWSの暗号鍵管理サービス。S3・EBS・RDSなどと連携します。",
        analogy: "🔐 金庫。特定の鍵（暗号鍵）がないと開けられない（読めない）",
        quiz: "「at rest（保存時）の暗号化」と「in transit（転送時）の暗号化」の違いは何ですか？",
        quizAnswer: "保存中のデータを暗号化するか、通信中のデータを暗号化するかの違い",
        quizOptions: ["速度の違い", "保存中のデータを暗号化するか、通信中のデータを暗号化するかの違い", "コストの違い", "使うサービスの違い"],
      },
      {
        word: "SSL/TLS証明書",
        read: "エスエスエル/ティーエルエス しょうめいしょ",
        eng: "SSL/TLS Certificate",
        level: 2,
        short: "Webサイトの「信頼証明書」",
        long: "WebサイトがHTTPS通信（暗号化）を行うために必要な電子証明書。認証機関（CA）が発行し、サイトの運営者が正当であることを証明します。ブラウザの🔒マークがこれです。",
        example: "AWSのACM（Certificate Manager）で無料のSSL証明書を取得し、ALBやCloudFrontに設定します。",
        aws: "ACMがAWSの証明書発行・管理サービス。CloudFront用はus-east-1リージョンで発行が必要です。",
        analogy: "🛂 パスポート（証明書）。「このWebサイトは信頼できる運営者が持つ正規のサイト」という証明",
        quiz: "SSL証明書の役割は何ですか？",
        quizAnswer: "HTTPS通信の暗号化とサイトの信頼性の証明",
        quizOptions: ["パスワードを保存する", "HTTPS通信の暗号化とサイトの信頼性の証明", "ファイルをバックアップする", "DNSを管理する"],
      },
      {
        word: "最小権限の原則",
        read: "さいしょうけんげんのげんそく",
        eng: "Principle of Least Privilege",
        level: 2,
        short: "必要最小限の権限だけを与えるセキュリティ原則",
        long: "ユーザーやシステムには、業務に必要な最小限の権限だけを付与するべき、というセキュリティの基本原則です。過剰な権限はセキュリティリスクを高めます。",
        example: "S3のデータを読むだけのプログラムに、S3の削除権限まで与えるのはNG。読み取り専用にします。",
        aws: "IAMポリシーの設計で必ず守るべき原則。AdministratorAccess（全権限）は最小化します。",
        analogy: "🗝️ 必要な部屋の鍵だけ渡す。倉庫係に社長室の鍵まで渡さない",
        quiz: "最小権限の原則に従うと、どのようなIAMポリシーが正しいですか？",
        quizAnswer: "業務に必要なS3の読み取り権限だけを付与する",
        quizOptions: ["AdministratorAccessをすべてのユーザーに付与する", "業務に必要なS3の読み取り権限だけを付与する", "全員にReadOnlyAccessを付与する", "権限は付与しない"],
      },
    ],
  },
  {
    id: "database",
    title: "データベース・ストレージ",
    emoji: "🗄️",
    color: "#10b981",
    dark: "#047857",
    light: "#f0fdf4",
    border: "#a7f3d0",
    desc: "データの保存・管理の仕組みを理解する",
    analogy: "図書館・倉庫・ファイルキャビネットのようなもの",
    terms: [
      {
        word: "データベース（DB）",
        read: "データベース",
        eng: "Database",
        level: 1,
        short: "データを整理して保存・検索できる仕組み",
        long: "大量のデータを効率的に保存・検索・更新できる仕組みです。Excelの超高機能版のようなものです。大きく「リレーショナルDB（RDB）」と「NoSQL」に分かれます。",
        example: "Amazonの商品情報・注文情報・ユーザー情報はすべてデータベースで管理されています。",
        aws: "RDS（リレーショナルDB）、DynamoDB（NoSQL）、Aurora（高性能RDB）などがあります。",
        analogy: "📚 図書館。本（データ）が整理されていて、タイトルや著者で素早く見つけられる",
        quiz: "データベースの主な役割は何ですか？",
        quizAnswer: "データを整理して保存・検索できるようにする",
        quizOptions: ["ファイルを暗号化する", "データを整理して保存・検索できるようにする", "通信を高速化する", "CPUの処理を行う"],
      },
      {
        word: "SQL",
        read: "エスキューエル（シークェル）",
        eng: "Structured Query Language",
        level: 2,
        short: "リレーショナルDBに命令する「言語」",
        long: "データベースを操作するための専用の言語。「SELECT（検索）」「INSERT（追加）」「UPDATE（更新）」「DELETE（削除）」が基本の4操作です。",
        example: "「SELECT * FROM users WHERE age > 20;」で「usersテーブルの20歳以上を全件取得」できます。",
        aws: "RDS（MySQL/PostgreSQL/Oracle）やAuroraがSQLを使うデータベースサービスです。",
        analogy: "📋 図書館の「検索機の使い方」。「著者が田中の本を新しい順に10冊」など条件指定で検索",
        quiz: "SQLのSELECT文の役割は何ですか？",
        quizAnswer: "データベースからデータを検索・取得する",
        quizOptions: ["データを削除する", "データを追加する", "データベースからデータを検索・取得する", "テーブルを作成する"],
      },
      {
        word: "RDB（リレーショナルDB）",
        read: "アールディービー",
        eng: "Relational Database",
        level: 2,
        short: "表形式でデータを管理するDB",
        long: "Excelのような「行と列の表形式（テーブル）」でデータを管理するDBです。テーブル間を「関係（リレーション）」でつなげて複雑なデータを効率よく管理できます。",
        example: "「注文テーブル」と「ユーザーテーブル」をユーザーIDでつないで、「誰がどの商品を注文したか」を検索できます。",
        aws: "Amazon RDS（MySQL/PostgreSQL/MariaDB/Oracle/SQL Server）、Amazon Auroraが対応します。",
        analogy: "📊 整理されたExcelのシートが複数あり、シート間の参照でデータを管理するイメージ",
        quiz: "RDBの特徴はどれですか？",
        quizAnswer: "表形式（テーブル）でデータを管理し、テーブル間を関係でつなぐ",
        quizOptions: ["JSONで自由にデータを保存できる", "表形式（テーブル）でデータを管理し、テーブル間を関係でつなぐ", "ファイルをそのまま保存する", "グラフ形式でデータを管理する"],
      },
      {
        word: "NoSQL",
        read: "ノーエスキューエル",
        eng: "NoSQL Database",
        level: 2,
        short: "表形式に縛られない柔軟なDB",
        long: "RDBの「表形式」に縛られず、JSONのような柔軟な形式でデータを保存できるDBです。大量データの高速処理が得意。キーバリュー型、ドキュメント型などがあります。",
        example: "SNSのタイムライン（毎秒何千件もの書き込み）や、IoTセンサーデータの大量書き込みに向いています。",
        aws: "DynamoDB（AWSのNoSQLサービス）が代表的。高可用性・フルマネージドが特徴です。",
        analogy: "📦 棚に置いた箱（ドキュメント）に何でも入れられる倉庫。中身の形は箱ごとに違っていい",
        quiz: "NoSQLがRDBより得意なことは何ですか？",
        quizAnswer: "大量データへの高速書き込み・柔軟なデータ形式",
        quizOptions: ["複雑なSQL結合処理", "大量データへの高速書き込み・柔軟なデータ形式", "厳格なデータ整合性の管理", "グラフデータの分析"],
      },
      {
        word: "バックアップ",
        read: "バックアップ",
        eng: "Backup",
        level: 1,
        short: "データのコピーを別の場所に保存しておくこと",
        long: "データを失ったとき（誤削除・障害など）に備えて、定期的にコピーを取ること。「いつ」「どこに」「どのくらいの期間」保存するかを設計することが重要です。",
        example: "RDSの自動バックアップを「7日間保持」に設定すると、7日前の状態にデータを戻せます。",
        aws: "RDSの自動バックアップ、S3のバージョニング、EBSスナップショットがバックアップ手段です。",
        analogy: "📄 重要書類のコピーを金庫に保管しておくこと。原本が失われてもコピーから復元できる",
        quiz: "バックアップの主な目的は何ですか？",
        quizAnswer: "データを失ったときに復元できるようにするため",
        quizOptions: ["データを高速化するため", "データを失ったときに復元できるようにするため", "セキュリティを強化するため", "コストを削減するため"],
      },
      {
        word: "キャッシュ",
        read: "キャッシュ",
        eng: "Cache",
        level: 2,
        short: "よく使うデータを一時的に高速な場所に保存する",
        long: "処理に時間がかかるデータ（DBの検索結果など）を一時的に高速なメモリに保存しておき、次回からは高速に返す仕組みです。Webサイトの高速化に必須の技術です。",
        example: "商品一覧ページを表示するとき、毎回DBを検索するより、キャッシュから返す方が100倍速くなることも。",
        aws: "ElastiCache（Redis/Memcached）がAWSのキャッシュサービス。CloudFrontもCDNキャッシュです。",
        analogy: "📋 よく使う書類を机の引き出し（高速）に置く。倉庫（DB）まで取りに行くより断然速い",
        quiz: "キャッシュを使う主なメリットは何ですか？",
        quizAnswer: "レスポンス速度の向上とDBへの負荷軽減",
        quizOptions: ["データの永続化", "セキュリティの向上", "レスポンス速度の向上とDBへの負荷軽減", "コストの削減"],
      },
    ],
  },
  {
    id: "cloud",
    title: "クラウド・インフラ",
    emoji: "☁️",
    color: "#f97316",
    dark: "#c2410c",
    light: "#fff7ed",
    border: "#fed7aa",
    desc: "クラウドとインフラの基本概念を理解する",
    analogy: "電気・水道のようなインフラサービス",
    terms: [
      {
        word: "クラウドコンピューティング",
        read: "クラウドコンピューティング",
        eng: "Cloud Computing",
        level: 1,
        short: "インターネット経由でITリソースを提供するサービス",
        long: "サーバー・ストレージ・ネットワークなどのITインフラをインターネット経由で利用できるサービスです。必要なときに必要な分だけ使い、使った分だけ支払います（従量課金）。",
        example: "自社でサーバーを買って管理する（オンプレミス）の代わりに、AWSを使うとすぐに大規模なインフラを利用できます。",
        aws: "AWSはクラウドコンピューティングサービスの最大手。200以上のサービスを提供します。",
        analogy: "💡 電気。発電所（クラウド）から電気（ITリソース）を引いて使った分だけ払う。自家発電（オンプレ）は不要",
        quiz: "クラウドコンピューティングの課金方式は何ですか？",
        quizAnswer: "使った分だけ支払う従量課金",
        quizOptions: ["年間一括払いのみ", "使った分だけ支払う従量課金", "無料で使い放題", "月額固定料金のみ"],
      },
      {
        word: "オンプレミス",
        read: "オンプレミス",
        eng: "On-premises",
        level: 1,
        short: "自社でサーバーを購入・設置・管理すること",
        long: "クラウドを使わず、自社のデータセンターや社内にサーバーを設置して管理する形態。「オンプレ」と略されます。初期コストが高く、スケールに時間がかかりますが、ハードウェアを完全に管理できます。",
        example: "銀行のシステムは長らくオンプレミスで運用されてきましたが、近年AWSへの移行が進んでいます。",
        aws: "AWSへの移行を「クラウドリフト（Lift）」と呼びます。AWS Migration Hubが支援します。",
        analogy: "🏭 自社工場で製品を全部作る（オンプレ）vs 外注する（クラウド）の違い",
        quiz: "オンプレミスの特徴として正しいものはどれですか？",
        quizAnswer: "自社でサーバーを購入・管理するため初期コストが高い",
        quizOptions: ["使った分だけ支払う従量課金", "自社でサーバーを購入・管理するため初期コストが高い", "すぐにスケールアップできる", "メンテナンスが不要"],
      },
      {
        word: "IaaS / PaaS / SaaS",
        read: "イアース / パース / サース",
        eng: "Infrastructure/Platform/Software as a Service",
        level: 2,
        short: "クラウドサービスの3つの提供形態",
        long: "IaaS（インフラ提供：EC2など）、PaaS（プラットフォーム提供：Elastic Beanstalkなど）、SaaS（ソフトウェア提供：Gmail・Salesforceなど）。管理の責任範囲が異なります。",
        example: "EC2（IaaS）はOSから自分で管理。RDS（PaaS寄り）はDBエンジンの管理をAWSが担当。Gmail（SaaS）はすべてGoogle管理。",
        aws: "EC2はIaaS、Elastic BeanstalkはPaaS、AWSのコンソール自体はSaaSに相当します。",
        analogy: "🍕 ピザで例えると：IaaS=食材を買って自分で焼く、PaaS=生地だけ買って自分でトッピング、SaaS=出来上がりを宅配",
        quiz: "AWSのEC2は何に分類されますか？",
        quizAnswer: "IaaS（Infrastructure as a Service）",
        quizOptions: ["SaaS", "PaaS", "IaaS（Infrastructure as a Service）", "DBaaS"],
      },
      {
        word: "可用性（Availability）",
        read: "かようせい",
        eng: "Availability",
        level: 2,
        short: "システムが正常に使える時間の割合",
        long: "システムが稼働して使用できる時間の割合です。「99.9%」なら年間約8.7時間の停止を許容。「99.99%」なら年間約52分。AWS SLAではサービスごとに可用性が規定されています。",
        example: "AWSのS3は99.99%の可用性を保証。EC2は99.99%（単一AZ）。複数AZで設計するとさらに向上します。",
        aws: "複数AZ（アベイラビリティゾーン）を使った設計が高可用性の基本です。",
        analogy: "⏰ コンビニの営業時間。「99.9%稼働」=年間8.7時間だけ閉まっている超ほぼ24時間営業",
        quiz: "可用性99.9%は年間何時間の停止を許容しますか？",
        quizAnswer: "約8.7時間",
        quizOptions: ["約1時間", "約8.7時間", "約24時間", "約100時間"],
      },
      {
        word: "スケールアップ / スケールアウト",
        read: "スケールアップ / スケールアウト",
        eng: "Scale Up / Scale Out",
        level: 2,
        short: "処理能力を増やす2つの方法",
        long: "スケールアップ（垂直スケール）：1台のサーバーのスペックを上げること。スケールアウト（水平スケール）：サーバーの台数を増やすこと。クラウドではスケールアウトが主流です。",
        example: "サイトのアクセスが増えたとき、「EC2を強いインスタンスに変更」=スケールアップ、「EC2を複数台に増やす」=スケールアウト。",
        aws: "Auto Scalingがスケールアウト/インを自動化。ELBで複数台に負荷分散します。",
        analogy: "🏗️ スケールアップ=トラック1台を大型に変える。スケールアウト=トラックの台数を増やす",
        quiz: "「Auto Scalingで台数を自動で増減する」はどちらですか？",
        quizAnswer: "スケールアウト（水平スケール）",
        quizOptions: ["スケールアップ（垂直スケール）", "スケールアウト（水平スケール）", "スケールダウン", "スケールイン"],
      },
      {
        word: "負荷分散（ロードバランシング）",
        read: "ふかぶんさん",
        eng: "Load Balancing",
        level: 2,
        short: "複数のサーバーにリクエストを分散する仕組み",
        long: "1台のサーバーにアクセスが集中しないよう、複数台のサーバーに処理を振り分ける仕組みです。ロードバランサー（LB）が振り分け役を担当します。1台が障害でも他が対応できます。",
        example: "AWSのALB（Application Load Balancer）を使うと、10台のEC2に自動でリクエストが分散されます。",
        aws: "ELB（Elastic Load Balancer）：ALB（HTTP/HTTPS）、NLB（TCP）、GLB（ゲートウェイ）の3種類があります。",
        analogy: "🏦 銀行の窓口。来店客（リクエスト）を空いている窓口（サーバー）に誘導する案内係",
        quiz: "AWSのALBの役割は何ですか？",
        quizAnswer: "HTTPリクエストを複数のEC2に分散する",
        quizOptions: ["データを暗号化する", "HTTPリクエストを複数のEC2に分散する", "IPアドレスを管理する", "ドメイン名を変換する"],
      },
      {
        word: "冗長化",
        read: "じょうちょうか",
        eng: "Redundancy",
        level: 2,
        short: "障害時に備えて予備のシステムを用意すること",
        long: "メインのシステムが故障したとき、自動的にバックアップのシステムに切り替えられるよう、あらかじめ予備を用意しておくことです。複数AZに分散配置が基本です。",
        example: "AWSのRDSでマルチAZ設定にすると、メインDBが障害でもスタンバイDBに自動で切り替わります。",
        aws: "RDSのマルチAZ、EC2のAuto ScalingとALB、S3の複数AZ保存が冗長化の例です。",
        analogy: "✈️ 飛行機のエンジン。1つ止まっても残りのエンジンで飛行を続けられる予備設計",
        quiz: "RDSのマルチAZ設定の目的は何ですか？",
        quizAnswer: "障害時に自動でスタンバイDBに切り替えて高可用性を確保する",
        quizOptions: ["コストを削減する", "パフォーマンスを向上させる", "障害時に自動でスタンバイDBに切り替えて高可用性を確保する", "バックアップを取得する"],
      },
    ],
  },
  {
    id: "devops",
    title: "開発・運用（DevOps）",
    emoji: "⚙️",
    color: "#ec4899",
    dark: "#9d174d",
    light: "#fdf2f8",
    border: "#fbcfe8",
    desc: "開発・運用の基本概念とCI/CDを理解する",
    analogy: "工場の生産ラインのようなもの",
    terms: [
      {
        word: "API",
        read: "エーピーアイ",
        eng: "Application Programming Interface",
        level: 1,
        short: "アプリ同士が通信するための「取り決め・窓口」",
        long: "異なるアプリやサービスがデータをやり取りするためのインターフェース（接続口）です。「天気予報アプリ」が気象庁のAPIを使って天気データを取得するようなイメージです。",
        example: "AWSの全サービスはAPIで操作できます。CLIやSDKはこのAPIを呼び出しています。",
        aws: "AWS CLIもAWS SDK（Python boto3など）も、内部ではAWSのAPIを呼び出しています。",
        analogy: "🍽️ レストランのメニューと注文カウンター。何を頼めるか（API仕様）と注文する窓口（エンドポイント）",
        quiz: "APIの役割は何ですか？",
        quizAnswer: "異なるアプリやサービスがデータをやり取りするための窓口",
        quizOptions: ["データを保存する仕組み", "異なるアプリやサービスがデータをやり取りするための窓口", "画面を表示する仕組み", "認証を行う仕組み"],
      },
      {
        word: "CI/CD",
        read: "シーアイ/シーディー",
        eng: "Continuous Integration / Continuous Delivery",
        level: 3,
        short: "コードの変更を自動でテスト・デプロイする仕組み",
        long: "CI（継続的インテグレーション）：コード変更のたびに自動でビルド・テストを実行。CD（継続的デリバリー/デプロイ）：テストを通過したコードを自動で本番環境に展開する仕組みです。",
        example: "GitHubにコードをpushすると、自動でテストが走り→Dockerイメージがビルドされ→ECSに自動デプロイ、という流れ。",
        aws: "CodePipeline・CodeBuild・CodeDeployがAWSのCI/CDサービス。GitHub Actionsとも連携できます。",
        analogy: "🏭 自動車の生産ライン。部品を入れたら（コードをpush）自動で検査（CI）→完成品（デプロイ）まで流れる",
        quiz: "CI/CDの「CD」が解決する課題は何ですか？",
        quizAnswer: "テスト済みのコードを手動なしで本番環境に自動展開する",
        quizOptions: ["コードのバグを自動で修正する", "テスト済みのコードを手動なしで本番環境に自動展開する", "コードを自動で最適化する", "データベースを自動でバックアップする"],
      },
      {
        word: "Infrastructure as Code（IaC）",
        read: "インフラストラクチャー・アズ・コード",
        eng: "Infrastructure as Code",
        level: 3,
        short: "インフラの設定をコードで管理すること",
        long: "サーバー・ネットワーク・DBなどのインフラ構成をコード（プログラム）として記述・管理することです。手動設定の代わりにコードで再現性・バージョン管理ができます。",
        example: "AWSのCloudFormationやTerraformを使うと、VPC・EC2・RDSをコードで一括作成・管理できます。",
        aws: "CloudFormation（AWS純正）、CDK（プログラミング言語でインフラを記述）がIaCツールです。",
        analogy: "🏗️ 建物の設計図（コード）。設計図があれば同じ建物を何度でも同じように建てられる",
        quiz: "IaC（Infrastructure as Code）のメリットは何ですか？",
        quizAnswer: "インフラ構成をコードで管理し、再現性・バージョン管理ができる",
        quizOptions: ["インフラのコストが無料になる", "インフラ構成をコードで管理し、再現性・バージョン管理ができる", "インターネット速度が上がる", "セキュリティが自動的に向上する"],
      },
      {
        word: "マイクロサービス",
        read: "マイクロサービス",
        eng: "Microservices",
        level: 3,
        short: "機能を小さなサービスに分割するアーキテクチャ",
        long: "アプリケーションを「ユーザー管理」「決済」「通知」などの小さな独立したサービスに分割する設計手法。各サービスを独立してデプロイ・スケールできます。対義語はモノリシック（一枚岩）アーキテクチャ。",
        example: "Amazonのショッピングサイトは、検索・カート・決済・配送追跡などがそれぞれ独立したマイクロサービスです。",
        aws: "ECS/EKS（コンテナ）、API Gateway、Lambda（サーバーレス）の組み合わせがマイクロサービスの基盤になります。",
        analogy: "🔧 家電のパーツ構成。テレビが壊れてもエアコンは動く。パーツごとに独立して修理・交換できる",
        quiz: "マイクロサービスのメリットはどれですか？",
        quizAnswer: "各サービスを独立してデプロイ・スケールできる",
        quizOptions: ["開発がシンプルになる", "各サービスを独立してデプロイ・スケールできる", "データベースが不要になる", "セキュリティが向上する"],
      },
      {
        word: "サーバーレス",
        read: "サーバーレス",
        eng: "Serverless",
        level: 2,
        short: "サーバー管理不要で関数を実行できる仕組み",
        long: "サーバーの起動・管理・スケールをクラウドが自動で行い、開発者はコード（関数）だけを書けばよい実行環境です。使った分だけ課金で、自動スケールします。",
        example: "AWS Lambdaは関数コードをアップロードするだけで動き、呼ばれた回数×実行時間の分だけ課金されます。",
        aws: "Lambda（FaaS）、Fargate（サーバーレスコンテナ）、DynamoDB、S3などがサーバーレスサービスです。",
        analogy: "💡 電気のスイッチ。電力会社（AWS）がインフラを管理してくれて、あなたはスイッチを押す（コードを実行）だけ",
        quiz: "サーバーレスのメリットはどれですか？",
        quizAnswer: "サーバー管理が不要で、使った分だけ課金される",
        quizOptions: ["パフォーマンスが常に最高になる", "サーバー管理が不要で、使った分だけ課金される", "無制限に無料で使える", "SQLが不要になる"],
      },
      {
        word: "モニタリング・ロギング",
        read: "モニタリング・ロギング",
        eng: "Monitoring / Logging",
        level: 2,
        short: "システムの状態を監視しログを記録すること",
        long: "モニタリング：システムのCPU・メモリ・エラー率などをリアルタイムで監視すること。ロギング：いつ・誰が・何をしたかの記録を保存すること。障害の検知・原因調査に必須です。",
        example: "CloudWatchでEC2のCPU使用率が80%を超えたらアラートを送り、CloudTrailでAPIの操作履歴を記録します。",
        aws: "CloudWatch（メトリクス監視・ログ収集）、CloudTrail（API監査ログ）、X-Ray（トレーシング）が対応します。",
        analogy: "🏥 患者の状態を24時間モニター（監視）しカルテ（ログ）に記録する。異常があればアラームが鳴る",
        quiz: "AWSでAPIの操作履歴を記録するサービスはどれですか？",
        quizAnswer: "AWS CloudTrail",
        quizOptions: ["Amazon CloudWatch", "AWS CloudTrail", "AWS Config", "Amazon GuardDuty"],
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════
   クイズコンポーネント
══════════════════════════════════════════════════════════════ */
function Quiz({ term, color, onClose }) {
  const [selected, setSelected] = useState(null);
  const correct = term.quizAnswer;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "white", borderRadius: 20, padding: 28, maxWidth: 460, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: 2, marginBottom: 8 }}>❓ QUIZ</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 20, lineHeight: 1.5 }}>{term.quiz}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {term.quizOptions.map((opt, i) => {
            const isSelected = selected === opt;
            const isCorrect = opt === correct;
            const showResult = selected !== null;
            let bg = "#f8fafc", border = "#e2e8f0", textColor = "#374151";
            if (showResult && isCorrect) { bg = "#f0fdf4"; border = "#22c55e"; textColor = "#166534"; }
            else if (showResult && isSelected && !isCorrect) { bg = "#fef2f2"; border = "#ef4444"; textColor = "#991b1b"; }
            return (
              <button key={i} onClick={() => !selected && setSelected(opt)}
                style={{ padding: "12px 16px", borderRadius: 10, border: `2px solid \${border}`, background: bg, color: textColor, textAlign: "left", cursor: selected ? "default" : "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, transition: "all 0.2s" }}>
                {showResult && isCorrect ? "✅ " : showResult && isSelected && !isCorrect ? "❌ " : ""}{opt}
              </button>
            );
          })}
        </div>
        {selected && (
          <div style={{ background: selected === correct ? "#f0fdf4" : "#fef2f2", border: `2px solid \${selected === correct ? "#22c55e" : "#ef4444"}`, borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: selected === correct ? "#166534" : "#991b1b", fontWeight: 600 }}>
            {selected === correct ? "🎉 正解！" : `😅 不正解。正解は「\${correct}」です。`}
          </div>
        )}
        <button onClick={onClose} style={{ width: "100%", padding: "11px", borderRadius: 10, border: "none", background: color, color: "white", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          {selected ? "閉じる" : "スキップして閉じる"}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   単語カードコンポーネント
══════════════════════════════════════════════════════════════ */
function TermCard({ term, color, light, border, dark, onQuiz, isLearned, onToggleLearn }) {
  const [expanded, setExpanded] = useState(false);
  const levelColors = ["#22c55e", "#f59e0b", "#ef4444"];
  const levelLabels = ["基礎", "標準", "応用"];
  return (
    <div style={{
      border: `2px solid \${isLearned ? "#22c55e" : border}`,
      borderRadius: 14, background: isLearned ? "#f0fdf4" : "white",
      overflow: "hidden", transition: "all 0.3s",
      boxShadow: expanded ? `0 8px 24px \${border}80` : "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      {/* header */}
      <div style={{ padding: "14px 16px", cursor: "pointer", display: "flex", gap: 10, alignItems: "flex-start" }}
        onClick={() => setExpanded(!expanded)}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: `\${levelColors[term.level - 1]}20`, color: levelColors[term.level - 1], fontWeight: 700, border: `1px solid \${levelColors[term.level - 1]}40` }}>
              {levelLabels[term.level - 1]}
            </span>
            <span style={{ fontSize: 10, color: "#94a3b8" }}>{term.eng}</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>{term.word}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{term.read}</div>
          <div style={{ fontSize: 13, color: "#475569", marginTop: 6, fontWeight: 600 }}>💬 {term.short}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", flexShrink: 0 }}>
          <span style={{ fontSize: 16, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}>⌄</span>
          <button onClick={(e) => { e.stopPropagation(); onToggleLearn(); }}
            style={{ fontSize: 10, padding: "3px 8px", borderRadius: 8, border: `1px solid \${isLearned ? "#22c55e" : "#e2e8f0"}`, background: isLearned ? "#f0fdf4" : "white", color: isLearned ? "#16a34a" : "#94a3b8", cursor: "pointer", fontWeight: 700 }}>
            {isLearned ? "✓ 習得" : "未習得"}
          </button>
        </div>
      </div>

      {/* detail */}
      {expanded && (
        <div style={{ borderTop: `1px solid \${border}`, padding: "14px 16px", background: light }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: dark, marginBottom: 5, letterSpacing: 1 }}>📖 詳しい説明</div>
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>{term.long}</div>
          </div>
          <div style={{ background: "#fffbeb", border: "1px solid #fde047", borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#92400e", marginBottom: 3 }}>🌟 身近な例</div>
            <div style={{ fontSize: 12, color: "#78350f", lineHeight: 1.7 }}>{term.example}</div>
          </div>
          <div style={{ background: `\${light}`, border: `1px solid \${border}`, borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: dark, marginBottom: 3 }}>☁️ AWSとの関連</div>
            <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.7 }}>{term.aws}</div>
          </div>
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#15803d", marginBottom: 3 }}>💡 覚え方のたとえ</div>
            <div style={{ fontSize: 12, color: "#166534", lineHeight: 1.7 }}>{term.analogy}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onQuiz(term)}
              style={{ flex: 1, padding: "10px", borderRadius: 8, border: `2px solid \${color}`, background: color, color: "white", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700 }}>
              ❓ クイズに挑戦
            </button>
            <button onClick={() => onToggleLearn()}
              style={{ flex: 1, padding: "10px", borderRadius: 8, border: `2px solid \${isLearned ? "#22c55e" : "#e2e8f0"}`, background: isLearned ? "#22c55e" : "white", color: isLearned ? "white" : "#64748b", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700 }}>
              {isLearned ? "✓ 習得済み" : "習得した！"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   メインアプリ
══════════════════════════════════════════════════════════════ */
export default function CLFTermsCurriculum() {
  const [activeCat, setActiveCat] = useState(0);
  const [learned, setLearned] = useState({});
  const [quizTerm, setQuizTerm] = useState(null);
  const [filter, setFilter] = useState("all"); // all / learned / unlearned
  const [search, setSearch] = useState("");

  const cat = CATEGORIES[activeCat];
  const totalTerms = CATEGORIES.reduce((a, c) => a + c.terms.length, 0);
  const learnedCount = Object.keys(learned).length;

  const termKey = (catId, word) => `\${catId}:\${word}`;
  const toggleLearn = (catId, word) => {
    const k = termKey(catId, word);
    setLearned(prev => { const n = { ...prev }; n[k] ? delete n[k] : (n[k] = true); return n; });
  };
  const isLearned = (catId, word) => !!learned[termKey(catId, word)];
  const catLearnedCount = cat.terms.filter(t => isLearned(cat.id, t.word)).length;

  const filteredTerms = cat.terms.filter(t => {
    const matchFilter = filter === "all" || (filter === "learned" && isLearned(cat.id, t.word)) || (filter === "unlearned" && !isLearned(cat.id, t.word));
    const matchSearch = search === "" || t.word.includes(search) || t.eng.toLowerCase().includes(search.toLowerCase()) || t.short.includes(search);
    return matchFilter && matchSearch;
  });

  // stagger animation counter
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Hiragino Kaku Gothic ProN','Meiryo',sans-serif" }}>
      {/* QUIZ overlay */}
      {quizTerm && <Quiz term={quizTerm} color={cat.color} onClose={() => setQuizTerm(null)} />}

      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2027 100%)",
        padding: "22px 20px 18px",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `linear-gradient(135deg, \${cat.color}, \${cat.dark})`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              boxShadow: `0 0 20px \${cat.color}60`,
              transition: "all 0.4s",
            }}>{cat.emoji}</div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#64748b", textTransform: "uppercase" }}>AWS CLF 前提知識</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "white", letterSpacing: -0.5 }}>IT用語マスターコース</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>総合習得率</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: cat.color }}>{learnedCount}<span style={{ fontSize: 12, color: "#475569" }}>/{totalTerms}</span></div>
              <div style={{ width: 100, height: 4, background: "#1e293b", borderRadius: 4, marginTop: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `\${(learnedCount / totalTerms) * 100}%`, background: `linear-gradient(90deg, \${cat.color}, #a855f7)`, transition: "width 0.6s ease" }} />
              </div>
            </div>
          </div>

          {/* カテゴリタブ */}
          <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 2 }}>
            {CATEGORIES.map((c, i) => {
              const catDone = c.terms.filter(t => isLearned(c.id, t.word)).length;
              const isActive = i === activeCat;
              return (
                <button key={i} onClick={() => { setActiveCat(i); setFilter("all"); setSearch(""); }}
                  style={{
                    padding: "6px 12px", borderRadius: 20, whiteSpace: "nowrap",
                    border: `2px solid \${isActive ? c.color : "rgba(255,255,255,0.08)"}`,
                    background: isActive ? `\${c.color}22` : "transparent",
                    color: isActive ? "white" : "rgba(255,255,255,0.35)",
                    cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 700,
                    transition: "all 0.2s",
                    boxShadow: isActive ? `0 0 12px \${c.color}40` : "none",
                  }}>
                  {c.emoji} {c.title} <span style={{ opacity: 0.6, fontSize: 10 }}>{catDone}/{c.terms.length}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "16px 14px 40px" }}>
        {/* カテゴリ説明 */}
        <div style={{
          background: `linear-gradient(135deg, \${cat.light}, white)`,
          border: `2px solid \${cat.border}`,
          borderRadius: 14, padding: "14px 16px", marginBottom: 16,
          display: "flex", gap: 12, alignItems: "center",
        }}>
          <div style={{ fontSize: 32 }}>{cat.emoji}</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: cat.dark }}>{cat.title}</div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>{cat.desc}</div>
            <div style={{ fontSize: 11, color: cat.color, marginTop: 4 }}>💡 {cat.analogy}</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: cat.color }}>{catLearnedCount}</div>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>/{cat.terms.length} 習得</div>
            <div style={{
              width: 60, height: 4, background: "#e2e8f0", borderRadius: 4, marginTop: 4, overflow: "hidden",
            }}>
              <div style={{ height: "100%", width: `\${(catLearnedCount / cat.terms.length) * 100}%`, background: cat.color, transition: "width 0.5s" }} />
            </div>
          </div>
        </div>

        {/* 検索・フィルター */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 用語を検索..."
            style={{
              flex: 1, minWidth: 150, padding: "9px 14px", borderRadius: 10,
              border: "2px solid #e2e8f0", fontFamily: "inherit", fontSize: 13,
              outline: "none", background: "white",
            }}
          />
          {["all", "unlearned", "learned"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: "8px 14px", borderRadius: 10, fontFamily: "inherit", fontSize: 12, fontWeight: 700,
                border: `2px solid \${filter === f ? cat.color : "#e2e8f0"}`,
                background: filter === f ? cat.light : "white",
                color: filter === f ? cat.color : "#64748b",
                cursor: "pointer", transition: "all 0.2s",
              }}>
              {f === "all" ? "すべて" : f === "learned" ? "✓ 習得済み" : "未習得"}
            </button>
          ))}
        </div>

        {/* 難易度凡例 */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          {[["基礎", "#22c55e", "CLF必須"], ["標準", "#f59e0b", "CLFで頻出"], ["応用", "#ef4444", "理解で差がつく"]].map(([lv, col, desc]) => (
            <div key={lv} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
              <span style={{ padding: "2px 7px", borderRadius: 10, background: `\${col}20`, color: col, fontWeight: 700, border: `1px solid \${col}40` }}>{lv}</span>
              <span style={{ color: "#94a3b8" }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* 単語リスト */}
        {filteredTerms.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div style={{ fontSize: 14 }}>該当する用語がありません</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredTerms.map((term, i) => (
              <div key={term.word} style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(10px)", transition: `all 0.3s ease \${i * 0.04}s` }}>
                <TermCard
                  term={term}
                  color={cat.color}
                  light={cat.light}
                  border={cat.border}
                  dark={cat.dark}
                  onQuiz={setQuizTerm}
                  isLearned={isLearned(cat.id, term.word)}
                  onToggleLearn={() => toggleLearn(cat.id, term.word)}
                />
              </div>
            ))}
          </div>
        )}

        {/* 全習得達成メッセージ */}
        {catLearnedCount === cat.terms.length && (
          <div style={{
            marginTop: 20, background: `linear-gradient(135deg,\${cat.light},#f0fdf4)`,
            border: `2px solid \${cat.color}`, borderRadius: 16, padding: "20px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: cat.dark }}>「{cat.title}」完全習得！</div>
            <div style={{ fontSize: 13, color: "#374151", marginTop: 6, lineHeight: 1.7 }}>
              次のカテゴリに進みましょう！<br />
              全カテゴリ完了でCLF試験の前提知識は万全です 🚀
            </div>
          </div>
        )}

        {/* 総合完了 */}
        {learnedCount === totalTerms && (
          <div style={{
            marginTop: 20, background: "linear-gradient(135deg,#f0fdf4,#fef9c3)",
            border: "2px solid #22c55e", borderRadius: 16, padding: "24px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🏆</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#15803d" }}>全用語マスター達成！</div>
            <div style={{ fontSize: 13, color: "#374151", marginTop: 8, lineHeight: 1.8 }}>
              IT用語の基礎は完璧です！<br />
              いよいよAWSのサービス学習に進みましょう。<br />
              <strong>次のステップ：AWS CLFハンズオンカリキュラムへ 🚀</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
