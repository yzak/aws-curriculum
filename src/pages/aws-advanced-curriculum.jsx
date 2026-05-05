import { useState } from "react";

/* ═══════════════════════════════════════════════════════
   共通コンポーネント
═══════════════════════════════════════════════════════ */
function Term({ word, desc }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ display: "inline-block", position: "relative", marginBottom: 4 }}>
      <span onClick={() => setOpen(!open)} style={{
        background: "#fef9c3", border: "1px solid #fde047", borderRadius: 4,
        padding: "2px 7px", fontSize: 12, color: "#854d0e", cursor: "pointer", fontWeight: 700,
      }}>{word} ❓</span>
      {open && (
        <div style={{
          position: "absolute", top: "110%", left: 0, zIndex: 200,
          background: "#1e293b", color: "#e2e8f0", borderRadius: 10,
          padding: "12px 14px", fontSize: 12, lineHeight: 1.7, width: 260,
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)", marginTop: 4,
        }}>
          <div style={{ fontWeight: 700, color: "#fbbf24", marginBottom: 4 }}>{word}</div>
          {desc}
          <div style={{ textAlign: "right", marginTop: 8 }}>
            <span onClick={() => setOpen(false)} style={{ fontSize: 10, color: "#64748b", cursor: "pointer" }}>閉じる ×</span>
          </div>
        </div>
      )}
    </span>
  );
}

function CodeBlock({ code }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <button onClick={() => setShow(!show)} style={{
        width: "100%", padding: "10px 16px", borderRadius: show ? "10px 10px 0 0" : 10,
        border: "2px solid #1e293b", background: show ? "#0f172a" : "white",
        color: show ? "#7dd3fc" : "#1e293b", cursor: "pointer",
        fontFamily: "inherit", fontSize: 13, fontWeight: 700, textAlign: "left",
        transition: "all 0.2s",
      }}>
        {show ? "▲ CLIコマンドを隠す" : "▼ CLIコマンドも確認する"}
      </button>
      {show && (
        <div style={{ background: "#0f172a", borderRadius: "0 0 10px 10px", padding: "16px", overflowX: "auto" }}>
          <pre style={{ margin: 0, fontSize: 11, lineHeight: 1.8, color: "#7dd3fc", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{code}</pre>
        </div>
      )}
    </div>
  );
}

function StepCard({ step, color, lightColor, borderColor, emoji, stepNum, totalSteps, isCompleted, onComplete, onPrev, showPrev, isLast }) {
  return (
    <div style={{ background: "white", border: `2px solid \${borderColor}`, borderRadius: 16, overflow: "hidden", boxShadow: `0 4px 24px \${borderColor}60` }}>
      <div style={{ background: lightColor, padding: "16px 20px", borderBottom: `2px solid \${borderColor}`, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: color, fontWeight: 700, letterSpacing: 1 }}>STEP {stepNum} / {totalSteps} ⏱ {step.duration}</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#1e293b" }}>{step.title}</div>
        </div>
        {isCompleted && <div style={{ background: "#22c55e", color: "white", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>✓ 完了</div>}
      </div>

      <div style={{ padding: "20px" }}>
        {/* what */}
        <div style={{ background: lightColor, borderRadius: 10, padding: "13px 15px", marginBottom: 14, borderLeft: `4px solid \${color}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: color, marginBottom: 5, letterSpacing: 1 }}>📖 このステップでやること</div>
          <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{step.what}</div>
        </div>

        {/* terms */}
        {step.terms && step.terms.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 7, letterSpacing: 1 }}>📚 用語をタップして確認</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {step.terms.map((t, i) => <Term key={i} word={t.word} desc={t.desc} />)}
            </div>
          </div>
        )}

        {/* console */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#1e40af", marginBottom: 9, letterSpacing: 1 }}>🖱️ コンソール操作手順</div>
          {step.console.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: i < step.console.length - 1 ? "1px solid #f1f5f9" : "none", alignItems: "flex-start" }}>
              <div style={{ width: 21, height: 21, borderRadius: "50%", background: color, color: "white", fontSize: 10, fontWeight: 700, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{c}</div>
            </div>
          ))}
        </div>

        {/* code */}
        {step.code && <CodeBlock code={step.code} />}

        {/* check */}
        <div style={{ background: "#f0fdf4", border: "2px solid #86efac", borderRadius: 10, padding: "13px 15px", marginBottom: 12, display: "flex", gap: 10 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>✅</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", marginBottom: 3 }}>確認チェック</div>
            <div style={{ fontSize: 13, color: "#166534", lineHeight: 1.6 }}>{step.check}</div>
          </div>
        </div>

        {/* tip */}
        <div style={{ background: "#fffbeb", border: "2px solid #fcd34d", borderRadius: 10, padding: "13px 15px", marginBottom: 18, display: "flex", gap: 10 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 3 }}>ポイント</div>
            <div style={{ fontSize: 13, color: "#78350f", lineHeight: 1.6 }}>{step.point}</div>
          </div>
        </div>

        {/* nav */}
        <div style={{ display: "flex", gap: 10 }}>
          {showPrev && (
            <button onClick={onPrev} style={{ padding: "11px 18px", borderRadius: 10, border: "2px solid #e2e8f0", background: "white", color: "#475569", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700 }}>← 前へ</button>
          )}
          <button onClick={onComplete} style={{
            flex: 1, padding: "11px 18px", borderRadius: 10, border: "none",
            background: isCompleted ? "linear-gradient(135deg,#22c55e,#16a34a)" : `linear-gradient(135deg,\${color},\${color}cc)`,
            color: "white", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 800,
            boxShadow: `0 4px 14px \${color}50`,
          }}>
            {isLast ? (isCompleted ? "🎉 完了！" : "✅ 完了！") : (isCompleted ? "次のステップへ →" : "✅ 完了して次へ →")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   アーキテクチャ図
═══════════════════════════════════════════════════════ */
function ArchS3({ step }) {
  const d = (s) => step > s, a = (s) => step === s;
  const bc = (s) => a(s) ? "#f97316" : d(s) ? "#22c55e" : "#e2e8f0";
  const bg = (s) => a(s) ? "#fff7ed" : d(s) ? "#f0fdf4" : "#f8fafc";
  const tc = (s) => a(s) ? "#ea580c" : d(s) ? "#16a34a" : "#94a3b8";
  const ic = (s) => d(s) ? "✅" : a(s) ? "⚡" : "○";
  return (
    <div style={{ background: "#f0f9ff", border: "2px solid #bae6fd", borderRadius: 16, padding: "16px", marginBottom: 16, fontFamily: "inherit" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#0369a1", marginBottom: 12, textAlign: "center", letterSpacing: 1 }}>🗺️ S3 完成アーキテクチャ</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ padding: "6px 16px", background: "#e0f2fe", border: "2px solid #7dd3fc", borderRadius: 20, fontSize: 12, color: "#0369a1", fontWeight: 700 }}>🌐 ユーザー（ブラウザ）</div>
        <div style={{ fontSize: 16, color: "#94a3b8" }}>↓</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            [0, "🪣 S3バケット作成"],
            [1, "📁 静的ファイルをアップロード"],
            [2, "🔓 静的ウェブサイトホスティング有効化"],
            [3, "🔒 バケットポリシーで公開"],
            [4, "📊 バージョニング＆ライフサイクル"],
          ].map(([s, label]) => (
            <div key={s} style={{ padding: "6px 12px", borderRadius: 8, border: `2px solid \${bc(s)}`, background: bg(s), color: tc(s), fontSize: 11, fontWeight: 700, transition: "all 0.3s", textAlign: "center" }}>
              {ic(s)} {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArchIAM({ step }) {
  const d = (s) => step > s, a = (s) => step === s;
  const bc = (s) => a(s) ? "#f97316" : d(s) ? "#22c55e" : "#e2e8f0";
  const bg = (s) => a(s) ? "#fff7ed" : d(s) ? "#f0fdf4" : "#f8fafc";
  const tc = (s) => a(s) ? "#ea580c" : d(s) ? "#16a34a" : "#94a3b8";
  const ic = (s) => d(s) ? "✅" : a(s) ? "⚡" : "○";
  return (
    <div style={{ background: "#fdf4ff", border: "2px solid #e9d5ff", borderRadius: 16, padding: "16px", marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#7e22ce", marginBottom: 12, textAlign: "center", letterSpacing: 1 }}>🗺️ IAM 完成アーキテクチャ</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          [0, "👤 IAMユーザー作成"],
          [1, "📋 IAMポリシー作成"],
          [2, "👥 IAMグループで管理"],
          [3, "🎭 EC2用IAMロール作成"],
          [4, "🔍 権限の確認とテスト"],
        ].map(([s, label]) => (
          <div key={s} style={{ padding: "6px 12px", borderRadius: 8, border: `2px solid \${bc(s)}`, background: bg(s), color: tc(s), fontSize: 11, fontWeight: 700, transition: "all 0.3s" }}>
            {ic(s)} {label}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ padding: "5px 10px", border: "2px dashed #a78bfa", borderRadius: 8, fontSize: 10, color: "#7c3aed", background: "#f5f3ff" }}>👤 IAMユーザー</div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>→</div>
        <div style={{ padding: "5px 10px", border: "2px dashed #a78bfa", borderRadius: 8, fontSize: 10, color: "#7c3aed", background: "#f5f3ff" }}>👥 グループ</div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>→</div>
        <div style={{ padding: "5px 10px", border: "2px dashed #a78bfa", borderRadius: 8, fontSize: 10, color: "#7c3aed", background: "#f5f3ff" }}>📋 ポリシー</div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>／</div>
        <div style={{ padding: "5px 10px", border: "2px dashed #f97316", borderRadius: 8, fontSize: 10, color: "#ea580c", background: "#fff7ed" }}>🖥️ EC2 ← 🎭 ロール → S3</div>
      </div>
    </div>
  );
}

function ArchECS({ step }) {
  const d = (s) => step > s, a = (s) => step === s;
  const bc = (s) => a(s) ? "#f97316" : d(s) ? "#22c55e" : "#e2e8f0";
  const bg = (s) => a(s) ? "#fff7ed" : d(s) ? "#f0fdf4" : "#f8fafc";
  const tc = (s) => a(s) ? "#ea580c" : d(s) ? "#16a34a" : "#94a3b8";
  const ic = (s) => d(s) ? "✅" : a(s) ? "⚡" : "○";
  return (
    <div style={{ background: "#f0fdf4", border: "2px solid #86efac", borderRadius: 16, padding: "16px", marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#15803d", marginBottom: 12, textAlign: "center", letterSpacing: 1 }}>🗺️ ECS/Fargate 完成アーキテクチャ</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ padding: "5px 14px", background: "#e0f2fe", border: "2px solid #7dd3fc", borderRadius: 20, fontSize: 11, color: "#0369a1", fontWeight: 700 }}>🌐 インターネット</div>
        <div style={{ fontSize: 14, color: "#94a3b8" }}>↓</div>
        <div style={{ padding: "5px 14px", border: `2px solid \${bc(3)}`, background: bg(3), borderRadius: 8, fontSize: 11, color: tc(3), fontWeight: 700, transition: "all 0.3s" }}>{ic(3)} ALB (Application Load Balancer)</div>
        <div style={{ fontSize: 14, color: "#94a3b8" }}>↓</div>
        <div style={{ border: "2px dashed #86efac", borderRadius: 12, padding: "10px 20px", background: "#f0fdf4", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#15803d", fontWeight: 700, marginBottom: 6 }}>ECS Cluster</div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {[
              [0, "ECR\nリポジトリ"],
              [1, "タスク\n定義"],
              [2, "ECS\nサービス"],
            ].map(([s, label]) => (
              <div key={s} style={{ padding: "5px 10px", border: `2px solid \${bc(s)}`, background: bg(s), borderRadius: 7, fontSize: 10, color: tc(s), fontWeight: 700, transition: "all 0.3s", textAlign: "center", whiteSpace: "pre" }}>
                {ic(s)} {label}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 6 }}>↑ Fargateが自動でサーバー管理</div>
        </div>
        <div style={{ padding: "5px 14px", border: `2px solid \${bc(4)}`, background: bg(4), borderRadius: 8, fontSize: 11, color: tc(4), fontWeight: 700, transition: "all 0.3s" }}>{ic(4)} CloudWatch Logs（ログ確認）</div>
      </div>
    </div>
  );
}

function ArchCF({ step }) {
  const d = (s) => step > s, a = (s) => step === s;
  const bc = (s) => a(s) ? "#f97316" : d(s) ? "#22c55e" : "#e2e8f0";
  const bg = (s) => a(s) ? "#fff7ed" : d(s) ? "#f0fdf4" : "#f8fafc";
  const tc = (s) => a(s) ? "#ea580c" : d(s) ? "#16a34a" : "#94a3b8";
  const ic = (s) => d(s) ? "✅" : a(s) ? "⚡" : "○";
  return (
    <div style={{ background: "#fff7ed", border: "2px solid #fed7aa", borderRadius: 16, padding: "16px", marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#c2410c", marginBottom: 12, textAlign: "center", letterSpacing: 1 }}>🗺️ CloudFront 完成アーキテクチャ</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{ padding: "5px 14px", background: "#e0f2fe", border: "2px solid #7dd3fc", borderRadius: 20, fontSize: 11, color: "#0369a1", fontWeight: 700 }}>🌐 ユーザー（世界中）</div>
        <div style={{ fontSize: 14, color: "#94a3b8" }}>↓</div>
        <div style={{ padding: "6px 16px", border: `2px solid \${bc(1)}`, background: bg(1), borderRadius: 10, fontSize: 11, color: tc(1), fontWeight: 700, transition: "all 0.3s" }}>{ic(1)} CloudFront ディストリビューション（CDN・HTTPS）</div>
        <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 4 }}>
          <div style={{ fontSize: 14, color: "#94a3b8", textAlign: "center" }}>↓<br /><span style={{ fontSize: 9 }}>静的コンテンツ</span></div>
          <div style={{ fontSize: 14, color: "#94a3b8", textAlign: "center" }}>↓<br /><span style={{ fontSize: 9 }}>動的API</span></div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ padding: "8px 12px", border: `2px solid \${bc(0)}`, background: bg(0), borderRadius: 8, fontSize: 10, color: tc(0), fontWeight: 700, transition: "all 0.3s", textAlign: "center" }}>
            {ic(0)} 🪣 S3バケット<br /><span style={{ fontWeight: 400 }}>静的ファイル配信</span>
          </div>
          <div style={{ padding: "8px 12px", border: `2px solid \${bc(2)}`, background: bg(2), borderRadius: 8, fontSize: 10, color: tc(2), fontWeight: 700, transition: "all 0.3s", textAlign: "center" }}>
            {ic(2)} ⚖️ ALB<br /><span style={{ fontWeight: 400 }}>動的コンテンツ</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {[[3, "🔒 ACM証明書(HTTPS)"], [4, "🌐 Route 53(独自ドメイン)"]].map(([s, label]) => (
            <div key={s} style={{ padding: "5px 10px", border: `2px solid \${bc(s)}`, background: bg(s), borderRadius: 7, fontSize: 10, color: tc(s), fontWeight: 700, transition: "all 0.3s" }}>{ic(s)} {label}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ステップデータ
═══════════════════════════════════════════════════════ */
const COURSES = [
  /* ───────────────── S3 ───────────────── */
  {
    id: "s3",
    title: "S3 ストレージ",
    emoji: "🪣",
    color: "#0ea5e9",
    lightColor: "#f0f9ff",
    borderColor: "#7dd3fc",
    duration: "40分",
    difficulty: "⭐☆☆",
    arch: ArchS3,
    steps: [
      {
        title: "S3バケットを作成する",
        emoji: "🪣", duration: "5分",
        what: "S3（Simple Storage Service）はAWSのオブジェクトストレージサービスです。バケットという「フォルダ」を作成し、その中にファイル（オブジェクト）を保存します。バケット名はグローバルで一意である必要があります。",
        terms: [
          { word: "S3", desc: "Simple Storage Service。容量無制限で安価なAWSのオブジェクトストレージ。画像・動画・ログ・バックアップなど何でも保存できます。" },
          { word: "バケット", desc: "S3の最上位コンテナ（フォルダのようなもの）。バケット名はAWS全体で一意である必要があります。" },
          { word: "オブジェクト", desc: "S3に保存されるファイルのこと。ファイル本体（データ）＋メタデータ（属性情報）で構成されます。" },
          { word: "リージョン", desc: "AWSのデータセンターの地域。S3はリージョンを選んでバケットを作成します。東京はap-northeast-1です。" },
        ],
        console: [
          "AWSコンソール検索で「S3」→「バケットを作成」をクリック",
          "バケット名: my-first-bucket-（自分の名前や日付）※世界唯一の名前",
          "AWSリージョン: アジアパシフィック（東京）ap-northeast-1",
          "「パブリックアクセスをすべてブロック」は今はそのままON（後で変更）",
          "バージョニング: 今は「無効」でOK（後のステップで有効化）",
          "「バケットを作成」をクリック",
        ],
        code: `# バケット名はグローバルで一意にする必要があります
BUCKET_NAME="my-first-bucket-$(date +%Y%m%d)-yourname"

aws s3api create-bucket \\
  --bucket $BUCKET_NAME \\
  --region ap-northeast-1 \\
  --create-bucket-configuration LocationConstraint=ap-northeast-1

# 作成確認
aws s3 ls | grep $BUCKET_NAME`,
        check: "S3バケット一覧にバケットが表示されていますか？",
        point: "バケット名は後から変更できません。命名規則は「小文字・数字・ハイフンのみ、3〜63文字」です。会社名や日付を含めると一意にしやすいです。",
      },
      {
        title: "ファイルをアップロードする",
        emoji: "📁", duration: "5分",
        what: "作成したバケットにファイルをアップロードします。コンソールからドラッグ&ドロップで簡単にアップロードできます。S3 CLIのsyncコマンドを使うとフォルダごとの同期も可能です。",
        terms: [
          { word: "オブジェクトキー", desc: "S3オブジェクトの「パス」のようなもの。例: images/photo.jpg のようにフォルダ構造を表現できます。" },
          { word: "メタデータ", desc: "オブジェクトに付与できる追加情報。Content-Type（ファイル種別）やキャッシュ設定などを設定できます。" },
          { word: "ストレージクラス", desc: "S3の料金プラン。Standard（高頻度）、Glacier（アーカイブ）など用途別に選択できます。" },
        ],
        console: [
          "バケットをクリックして中に入る",
          "「アップロード」ボタンをクリック",
          "「ファイルを追加」で任意のファイルを選択（例: index.html）",
          "ストレージクラス: S3 Standard（デフォルト）のまま",
          "「アップロード」をクリック",
          "CLIでフォルダごとアップロードする場合は下記のコマンドを使用",
        ],
        code: `# 単一ファイルのアップロード
echo '<h1>Hello from S3!</h1>' > index.html
aws s3 cp index.html s3://$BUCKET_NAME/index.html

# フォルダ全体を同期（ローカル→S3）
mkdir -p mysite && echo '<h1>Hello World!</h1>' > mysite/index.html
aws s3 sync ./mysite/ s3://$BUCKET_NAME/ \\
  --delete  # S3側にあってローカルにないファイルを削除

# アップロード確認
aws s3 ls s3://$BUCKET_NAME/ --human-readable

# オブジェクトの詳細確認
aws s3api head-object \\
  --bucket $BUCKET_NAME \\
  --key index.html`,
        check: "バケット内にファイルが表示されていますか？",
        point: "s3 sync はデプロイに非常に便利なコマンドです。差分のみ転送するので効率的です。--deleteオプションは不要ファイルの削除もしてくれますが、本番ではよく確認してから使いましょう。",
      },
      {
        title: "静的ウェブサイトホスティングを有効化する",
        emoji: "🌐", duration: "10分",
        what: "S3には静的ウェブサイトをホスティングする機能があります。HTMLファイルをアップロードしてホスティングを有効化するだけで、URLからWebページにアクセスできるようになります。",
        terms: [
          { word: "静的ウェブサイト", desc: "サーバーサイドの処理がないWebサイト。HTML・CSS・JavaScriptのみで構成されます。S3で格安ホスティングが可能です。" },
          { word: "エンドポイント", desc: "S3の静的ウェブサイトへアクセスするURL。http://バケット名.s3-website-リージョン.amazonaws.com 形式です。" },
        ],
        console: [
          "バケットの「プロパティ」タブを開く",
          "一番下の「静的ウェブサイトホスティング」を見つけて「編集」",
          "「有効にする」を選択",
          "インデックスドキュメント: index.html",
          "エラードキュメント: error.html（任意）",
          "「変更を保存」をクリック",
          "プロパティ画面に表示されたバケットウェブサイトエンドポイントURLをメモ",
        ],
        code: `# 静的ウェブサイトホスティングを有効化
aws s3api put-bucket-website \\
  --bucket $BUCKET_NAME \\
  --website-configuration '{
    "IndexDocument": {"Suffix": "index.html"},
    "ErrorDocument": {"Key": "error.html"}
  }'

# 設定確認
aws s3api get-bucket-website --bucket $BUCKET_NAME

# ウェブサイトエンドポイントを取得
echo "URL: http://\${BUCKET_NAME}.s3-website-ap-northeast-1.amazonaws.com"`,
        check: "プロパティ画面にウェブサイトエンドポイントURLが表示されていますか？（まだアクセスするとエラーが出ますが次のステップで解決します）",
        point: "S3の静的ホスティングはHTTPSに非対応です。HTTPSを使いたい場合はCloudFrontを前段に置きます（CloudFrontのハンズオンで実践します）。",
      },
      {
        title: "バケットポリシーで公開設定をする",
        emoji: "🔓", duration: "10分",
        what: "デフォルトではS3バケットは非公開です。静的ウェブサイトとして公開するには「バケットポリシー」でパブリックアクセスを許可する必要があります。",
        terms: [
          { word: "バケットポリシー", desc: "JSONで記述するS3の「誰が何を操作できるか」の設定。Principal(*=全員)にGetObjectを許可すると公開になります。" },
          { word: "パブリックアクセスブロック", desc: "S3の公開を全面ブロックする設定。ポリシーより優先されるため、先に解除が必要です。" },
          { word: "ARN", desc: "Amazon Resource Name。AWSリソースの一意な識別子。arn:aws:s3:::バケット名/* でバケット内全オブジェクトを指します。" },
        ],
        console: [
          "「アクセス許可」タブを開く",
          "「パブリックアクセスのブロック」で「編集」→全チェックを外してOFF→「変更を保存」",
          "確認ダイアログで「confirm」と入力して「確認」",
          "「バケットポリシー」欄で「編集」をクリック",
          "以下のJSONをコピーして貼り付け（バケット名を自分のものに変更）",
          "「変更を保存」をクリック",
          "ブラウザでエンドポイントURLにアクセスしてHTMLが表示されることを確認",
        ],
        code: `# パブリックアクセスブロックを解除
aws s3api put-public-access-block \\
  --bucket $BUCKET_NAME \\
  --public-access-block-configuration \\
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# バケットポリシーで公開設定
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::\${BUCKET_NAME}/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \\
  --bucket $BUCKET_NAME \\
  --policy file://bucket-policy.json

# 動作確認
curl http://\${BUCKET_NAME}.s3-website-ap-northeast-1.amazonaws.com`,
        check: "ブラウザでウェブサイトエンドポイントにアクセスして「Hello from S3!」や「Hello World!」が表示されましたか？🎉",
        point: "本番環境でS3を公開する際は、CloudFront + OAC（Origin Access Control）を使ってS3を非公開にしたままCloudFront経由でのみ配信するパターンが推奨です。",
      },
      {
        title: "バージョニングとライフサイクルを設定する",
        emoji: "📊", duration: "10分",
        what: "バージョニングを有効化するとファイルの変更履歴を全て保持できます。ライフサイクルルールを使うと古いバージョンを自動でGlacierに移動したり削除したりしてコストを最適化できます。",
        terms: [
          { word: "バージョニング", desc: "同じキーのオブジェクトを上書きするたびに旧バージョンを保持する機能。誤削除・誤上書きのリカバリに使えます。" },
          { word: "ライフサイクルルール", desc: "オブジェクトを自動で移動・削除するルール。「30日後にGlacierへ」「365日後に削除」などを自動化できます。" },
          { word: "S3 Glacier", desc: "長期アーカイブ用の格安ストレージ。Standardの約1/10〜1/4のコストですが、取り出しに数分〜数時間かかります。" },
        ],
        console: [
          "バケットの「プロパティ」タブ→「バケットのバージョニング」→「編集」→「有効にする」→保存",
          "同じindex.htmlを変更して再アップロード→バージョンが増えることを確認",
          "「バージョンを表示」トグルをONにして旧バージョンを確認",
          "「管理」タブ→「ライフサイクルルールを作成」",
          "ルール名: old-version-cleanup、スコープ: バケット内のすべてのオブジェクト",
          "ライフサイクルルールアクション:「以前のバージョンのオブジェクトを削除」にチェック",
          "オブジェクトが以前のバージョンになってからの日数: 90",
          "「ルールを作成」をクリック",
        ],
        code: `# バージョニングを有効化
aws s3api put-bucket-versioning \\
  --bucket $BUCKET_NAME \\
  --versioning-configuration Status=Enabled

# ファイルを更新してバージョンを増やす
echo '<h1>Version 2!</h1>' > index.html
aws s3 cp index.html s3://$BUCKET_NAME/

# バージョン一覧を確認
aws s3api list-object-versions \\
  --bucket $BUCKET_NAME \\
  --query 'Versions[*].{Key:Key,VersionId:VersionId,Latest:IsLatest}'

# ライフサイクルルール: 90日後に旧バージョンを削除
aws s3api put-bucket-lifecycle-configuration \\
  --bucket $BUCKET_NAME \\
  --lifecycle-configuration '{
    "Rules": [{
      "ID": "old-version-cleanup",
      "Status": "Enabled",
      "Filter": {"Prefix": ""},
      "NoncurrentVersionExpiration": {"NoncurrentDays": 90}
    }]
  }'`,
        check: "「バージョンを表示」で複数バージョンが確認でき、ライフサイクルルールが作成されていますか？",
        point: "バージョニングは有効にすると全オブジェクトの変更履歴が蓄積されストレージコストが増加します。ライフサイクルルールで旧バージョンを自動削除するのがコスト管理のベストプラクティスです。",
      },
    ],
  },

  /* ───────────────── IAM ───────────────── */
  {
    id: "iam",
    title: "IAM ロール・ポリシー",
    emoji: "🔐",
    color: "#a855f7",
    lightColor: "#fdf4ff",
    borderColor: "#d8b4fe",
    duration: "45分",
    difficulty: "⭐⭐☆",
    arch: ArchIAM,
    steps: [
      {
        title: "IAMユーザーを作成する",
        emoji: "👤", duration: "10分",
        what: "IAM（Identity and Access Management）はAWSリソースへのアクセスを管理するサービスです。まずは人間が使うIAMユーザーを作成します。AWSアカウントのルートユーザーは緊急時以外は使わないのが大原則です。",
        terms: [
          { word: "IAM", desc: "Identity and Access Management。誰が（ユーザー/ロール）、何を（ポリシー）、どのAWSリソースに対して操作できるかを管理します。" },
          { word: "ルートユーザー", desc: "AWSアカウントの最上位管理者。全権限を持つため日常操作には絶対使用禁止。MFAを設定して金庫にしまっておくイメージ。" },
          { word: "IAMユーザー", desc: "AWSコンソールやAPIを使う人間に対応するアカウント。必要最小限の権限のみ付与するのが原則。" },
          { word: "MFA", desc: "Multi-Factor Authentication（多要素認証）。パスワード＋スマホアプリのワンタイムパスワードで認証強度を上げます。" },
        ],
        console: [
          "AWSコンソール検索で「IAM」→左メニュー「ユーザー」→「ユーザーを作成」",
          "ユーザー名: dev-user-01",
          "「AWSマネジメントコンソールへのアクセスを提供する」にチェック",
          "「IAM ユーザーを作成します」を選択",
          "パスワード: 自動生成のまま（後で変更）",
          "「次へ」→権限は今は付与せず→「ユーザーの作成」",
          "「.csvをダウンロード」してログイン情報を保存",
        ],
        code: `# IAMユーザーを作成（コンソールアクセスなし・API用）
aws iam create-user --user-name dev-user-01

# コンソールログイン用パスワードを設定
aws iam create-login-profile \\
  --user-name dev-user-01 \\
  --password "TempPassword123!" \\
  --password-reset-required

# プログラムアクセス用アクセスキーを作成（CLIやSDK用）
aws iam create-access-key --user-name dev-user-01
# ⚠️ SecretAccessKeyは一度しか表示されません！必ず保存してください

# ユーザー確認
aws iam get-user --user-name dev-user-01`,
        check: "IAMユーザー一覧に「dev-user-01」が表示されていますか？",
        point: "ルートユーザーには必ずMFAを設定してください。日常的なAWS操作は必ずIAMユーザーで行うこと。これはAWSセキュリティの絶対原則です。",
      },
      {
        title: "IAMポリシーを作成する",
        emoji: "📋", duration: "10分",
        what: "IAMポリシーはJSONで記述する権限の設定書です。「誰が」「何のサービスの」「どの操作を」「どのリソースに対して」「許可/拒否する」を定義します。最小権限の原則（Least Privilege）が重要です。",
        terms: [
          { word: "ポリシー", desc: "AWSリソースへのアクセス権限をJSONで記述したもの。AWS管理ポリシー（既製品）とカスタマー管理ポリシー（自作）があります。" },
          { word: "最小権限の原則", desc: "ユーザーやシステムには必要最小限の権限だけを与えるセキュリティの原則。過剰な権限はセキュリティリスクになります。" },
          { word: "Effect", desc: "ポリシーのAllow（許可）またはDeny（拒否）。DenyはAllowより優先されます。" },
          { word: "Action", desc: "許可/拒否するAWS APIアクション。s3:GetObject、ec2:DescribeInstances など「サービス:操作」の形式で書きます。" },
          { word: "Resource", desc: "アクションを適用するAWSリソースのARN。*（ワイルドカード）で全リソースに適用できます。" },
        ],
        console: [
          "IAMの左メニュー「ポリシー」→「ポリシーを作成」",
          "「JSON」タブを選択して以下のJSONを入力",
          "（S3の特定バケットの読み取り専用ポリシー）",
          "「次へ」→ポリシー名: S3ReadOnlyMyBucket",
          "説明: Allow read-only access to specific S3 bucket",
          "「ポリシーを作成」をクリック",
        ],
        code: `# カスタムIAMポリシーを作成（特定S3バケットの読み取り専用）
cat > s3-readonly-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ListBucket",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": "arn:aws:s3:::my-first-bucket-*"
    },
    {
      "Sid": "AllowS3GetObject",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion"
      ],
      "Resource": "arn:aws:s3:::my-first-bucket-*/*"
    }
  ]
}
EOF

# ポリシーを作成
aws iam create-policy \\
  --policy-name S3ReadOnlyMyBucket \\
  --policy-document file://s3-readonly-policy.json

# ユーザーにポリシーを直接アタッチ（グループ経由が推奨だが練習用）
aws iam attach-user-policy \\
  --user-name dev-user-01 \\
  --policy-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/S3ReadOnlyMyBucket

# 権限シミュレーター（コンソールのIAM Policy Simulatorでも確認できます）
aws iam simulate-principal-policy \\
  --policy-source-arn arn:aws:iam::ACCOUNT_ID:user/dev-user-01 \\
  --action-names s3:GetObject \\
  --resource-arns arn:aws:s3:::my-first-bucket-*/test.txt`,
        check: "ポリシー一覧に「S3ReadOnlyMyBucket」が表示されていますか？",
        point: "ポリシーはActionとResourceを必要最小限に絞ることが重要です。s3:*（全操作）や Resource: *（全リソース）は安易に使わないこと。IAM Policy SimulatorでUI上から権限テストができます。",
      },
      {
        title: "IAMグループで権限を管理する",
        emoji: "👥", duration: "10分",
        what: "ユーザーが増えてきたとき、1人ずつポリシーを付与するのは非効率です。IAMグループを使うと「開発者グループ」「閲覧者グループ」のようにまとめて権限管理できます。",
        terms: [
          { word: "IAMグループ", desc: "複数のIAMユーザーをまとめる器。グループにポリシーをアタッチすると、グループ内の全ユーザーが同じ権限を持ちます。" },
          { word: "権限の継承", desc: "ユーザーがグループに所属すると、グループのポリシーが継承されます。ユーザー自身のポリシーとの「OR」になります。" },
        ],
        console: [
          "IAM左メニュー「ユーザーグループ」→「グループを作成」",
          "グループ名: developers",
          "ポリシーをアタッチ: 「AmazonS3ReadOnlyAccess」（AWS管理ポリシー）を検索して選択",
          "「グループを作成」をクリック",
          "作成したグループを開いて「ユーザーを追加」",
          "dev-user-01 を選択して「ユーザーを追加」",
          "ユーザー「dev-user-01」の「アクセス許可」タブでグループ経由の権限が表示されることを確認",
        ],
        code: `# developersグループを作成
aws iam create-group --group-name developers

# AWS管理ポリシー（S3読み取り専用）をグループにアタッチ
aws iam attach-group-policy \\
  --group-name developers \\
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

# CloudWatchの読み取り権限も追加
aws iam attach-group-policy \\
  --group-name developers \\
  --policy-arn arn:aws:iam::aws:policy/CloudWatchReadOnlyAccess

# ユーザーをグループに追加
aws iam add-user-to-group \\
  --group-name developers \\
  --user-name dev-user-01

# グループのポリシー一覧確認
aws iam list-attached-group-policies \\
  --group-name developers

# ユーザーの全有効権限を確認（グループ経由含む）
aws iam list-groups-for-user --user-name dev-user-01`,
        check: "dev-user-01 のアクセス許可タブに「developers（グループ経由）」の権限が表示されていますか？",
        point: "IAMのベストプラクティス: ユーザーへの直接ポリシーアタッチは避け、グループ経由で管理する。新入社員はグループに追加するだけで適切な権限が付与されます。退職時もグループから削除するだけです。",
      },
      {
        title: "EC2用IAMロールを作成する",
        emoji: "🎭", duration: "10分",
        what: "IAMロールはAWSサービス（EC2やLambdaなど）が他のAWSサービスにアクセスするための「仮の帽子」です。EC2のアクセスキーをコード内に書くのは危険なので、ロールを使って安全にS3やDynamoDBにアクセスします。",
        terms: [
          { word: "IAMロール", desc: "人ではなくAWSサービスやアプリケーションが使う権限の仕組み。EC2にロールを付与するとコードにキーを書かずにAWSサービスにアクセスできます。" },
          { word: "信頼ポリシー", desc: "「誰がこのロールを引き受けられるか」を定義するポリシー。EC2が使うロールにはec2.amazonaws.comを信頼します。" },
          { word: "インスタンスプロファイル", desc: "ロールをEC2に付与するためのラッパー。コンソールから操作するとロールと同時に自動作成されます。" },
          { word: "AssumeRole", desc: "一時的にロールの権限を引き受けること。EC2内のアプリはIMDS経由で自動的にロールの一時認証情報を取得します。" },
        ],
        console: [
          "IAM左メニュー「ロール」→「ロールを作成」",
          "信頼されたエンティティタイプ: 「AWSのサービス」を選択",
          "ユースケース: 「EC2」を選択→「次へ」",
          "ポリシーを検索「AmazonS3ReadOnlyAccess」を選択（S3読み取り専用）",
          "「次へ」→ロール名: EC2-S3-ReadOnly-Role",
          "説明: Role for EC2 to read from S3",
          "「ロールを作成」をクリック",
          "EC2インスタンスを選択→「アクション」→「セキュリティ」→「IAMロールを変更」→EC2-S3-ReadOnly-Roleを選択",
        ],
        code: `# EC2用のIAMロールを作成（信頼ポリシー: EC2サービスが引き受けられる）
cat > trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "ec2.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
EOF

aws iam create-role \\
  --role-name EC2-S3-ReadOnly-Role \\
  --assume-role-policy-document file://trust-policy.json \\
  --description "Role for EC2 to read from S3"

# S3読み取りポリシーをアタッチ
aws iam attach-role-policy \\
  --role-name EC2-S3-ReadOnly-Role \\
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

# インスタンスプロファイルを作成してロールを追加
aws iam create-instance-profile \\
  --instance-profile-name EC2-S3-ReadOnly-Profile
aws iam add-role-to-instance-profile \\
  --instance-profile-name EC2-S3-ReadOnly-Profile \\
  --role-name EC2-S3-ReadOnly-Role

# EC2にアタッチ（実行中のインスタンスにも付与可能）
aws ec2 associate-iam-instance-profile \\
  --instance-id i-xxxxxxxxxxxxxxxxx \\
  --iam-instance-profile Name=EC2-S3-ReadOnly-Profile

# EC2内からロールの確認（EC2のSSHセッション内で実行）
# curl http://169.254.169.254/latest/meta-data/iam/security-credentials/
# → EC2-S3-ReadOnly-Role が表示されれば成功`,
        check: "EC2インスタンスの「IAMロール」欄に「EC2-S3-ReadOnly-Role」が表示されていますか？",
        point: "EC2のコード内にアクセスキーを書いてはいけません！ロールを使えばコードにキーを書かずにS3にアクセスできます。環境変数や~/.aws/credentialsへのキー記載も本番では禁止です。",
      },
      {
        title: "権限の確認とPolicy Simulatorを使う",
        emoji: "🔍", duration: "5分",
        what: "IAM Policy Simulatorを使うと、実際に操作を実行する前に「この権限でこのAPIを実行できるか？」をシミュレーションできます。アクセス拒否のデバッグにも役立ちます。",
        terms: [
          { word: "Policy Simulator", desc: "IAMポリシーの権限テストツール。実際にAPIを呼び出さずに「允可されるか拒否されるか」を事前確認できます。" },
          { word: "Access Analyzer", desc: "IAMの権限分析ツール。外部からアクセスできるリソースや未使用の権限を自動検出してくれます。" },
          { word: "CloudTrail", desc: "AWSの全API呼び出しを記録する監査ログサービス。「誰がいつ何を操作したか」を追跡できます。" },
        ],
        console: [
          "IAM左メニュー「ポリシーシミュレーター」をクリック（または検索）",
          "「Select users, groups, and roles」でdev-user-01を選択",
          "「Select service」で「S3」を選択",
          "「Select actions」でGetObject、PutObject、DeleteObjectを選択",
          "「Run Simulation」をクリック",
          "GetObjectは「allowed」、PutObjectとDeleteObjectは「implicitly denied」になることを確認",
        ],
        code: `# CLIでポリシーシミュレーション
aws iam simulate-principal-policy \\
  --policy-source-arn arn:aws:iam::ACCOUNT_ID:user/dev-user-01 \\
  --action-names s3:GetObject s3:PutObject s3:DeleteObject \\
  --resource-arns "arn:aws:s3:::my-bucket/test.txt" \\
  --query 'EvaluationResults[*].{Action:EvalActionName,Decision:EvalDecision}'

# IAM Access Analyzerでリソース公開状況を分析
aws accessanalyzer list-analyzers

# CloudTrailで直近のIAM操作履歴を確認
aws cloudtrail lookup-events \\
  --lookup-attributes AttributeKey=EventSource,AttributeValue=iam.amazonaws.com \\
  --max-results 10 \\
  --query 'Events[*].{Time:EventTime,User:Username,Action:EventName}'

# 未使用のアクセスキーを確認（セキュリティ監査）
aws iam generate-credential-report
aws iam get-credential-report \\
  --query 'Content' --output text | base64 -d`,
        check: "Policy SimulatorでS3:GetObjectが「allowed」、S3:PutObjectが「denied」になることを確認できましたか？",
        point: "IAM権限の設定後は必ずPolicy Simulatorで意図通りの権限になっているか確認しましょう。本番適用前のテストが重要です。AWS Security HubやIAM Access Analyzerも定期的に確認する習慣をつけましょう。",
      },
    ],
  },

  /* ───────────────── ECS/Fargate ───────────────── */
  {
    id: "ecs",
    title: "ECS / Fargate",
    emoji: "🐳",
    color: "#10b981",
    lightColor: "#f0fdf4",
    borderColor: "#6ee7b7",
    duration: "60分",
    difficulty: "⭐⭐⭐",
    arch: ArchECS,
    steps: [
      {
        title: "Dockerイメージを作成してECRにプッシュする",
        emoji: "🐳", duration: "15分",
        what: "ECS/Fargateはコンテナを実行するサービスです。まずDockerイメージを作ってAWSのコンテナレジストリ（ECR）にアップロードします。nginxを使ってHello Worldを表示するシンプルなアプリを作ります。",
        terms: [
          { word: "ECS", desc: "Elastic Container Service。DockerコンテナをAWS上で管理・実行するサービス。Fargateと組み合わせてサーバーレスで使えます。" },
          { word: "Fargate", desc: "サーバー（EC2）の管理なしにコンテナを実行できる仕組み。サーバーのプロビジョニング・パッチ当ては不要になります。" },
          { word: "ECR", desc: "Elastic Container Registry。AWSのDockerイメージ保管場所。プライベートなDocker Hubのようなものです。" },
          { word: "Dockerイメージ", desc: "コンテナの設計図。Dockerfileというテキストファイルからビルドされます。どの環境でも同じように動くのが利点です。" },
        ],
        console: [
          "AWSコンソール検索で「ECR」→「リポジトリを作成」",
          "可視性: プライベート",
          "リポジトリ名: my-hello-world",
          "「リポジトリを作成」をクリック",
          "作成したリポジトリを開いて「プッシュコマンドを表示」をクリック",
          "表示されたコマンドを順番にターミナルで実行",
        ],
        code: `# 作業ディレクトリを作成
mkdir -p hello-ecs && cd hello-ecs

# Dockerfileを作成
cat > Dockerfile << 'EOF'
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
EXPOSE 80
EOF

# 表示するHTMLを作成
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Hello ECS/Fargate!</title>
  <style>
    body { font-family: sans-serif; display:flex; justify-content:center;
           align-items:center; height:100vh; margin:0;
           background: linear-gradient(135deg,#0f2027,#203a43,#2c5364); }
    .card { background:white; border-radius:16px; padding:40px 60px; text-align:center; }
    h1 { color:#0f2027; font-size:2.5em; margin:0 0 10px; }
    p { color:#555; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🐳 Hello ECS/Fargate!</h1>
    <p>コンテナでWebサーバーが動いています！</p>
  </div>
</body>
</html>
EOF

# ECRにログイン（リージョンとアカウントIDを設定）
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="ap-northeast-1"
ECR_URI="\${AWS_ACCOUNT_ID}.dkr.ecr.\${REGION}.amazonaws.com"

aws ecr get-login-password --region $REGION | \\
  docker login --username AWS --password-stdin $ECR_URI

# ECRリポジトリを作成
aws ecr create-repository \\
  --repository-name my-hello-world \\
  --region $REGION

# Dockerイメージをビルド
docker build -t my-hello-world .

# タグ付けしてECRにプッシュ
docker tag my-hello-world:latest $ECR_URI/my-hello-world:latest
docker push $ECR_URI/my-hello-world:latest

echo "Image URI: $ECR_URI/my-hello-world:latest"`,
        check: "ECRリポジトリにイメージがプッシュされ「latest」タグが表示されていますか？",
        point: "Fargateを使う場合、docker buildはローカルPC（またはCodeBuildなどのCI）で行い、ECRにpushします。本番ではGitHub ActionsやCodePipelineとECRを連携させてCI/CDを構築します。",
      },
      {
        title: "ECSタスク定義を作成する",
        emoji: "📋", duration: "15分",
        what: "タスク定義はコンテナの「設計図」です。使うDockerイメージ・CPU・メモリ・ポートマッピング・環境変数・ログ設定などを定義します。EC2でいうAMI+インスタンスタイプに相当します。",
        terms: [
          { word: "タスク定義", desc: "ECSコンテナの設計書。使うイメージ・リソース量・環境変数・ログ設定などを定義します。バージョン管理されます。" },
          { word: "タスク", desc: "タスク定義を元に実際に起動したコンテナの実行単位。1タスク=1つ以上のコンテナのグループ。" },
          { word: "コンテナ定義", desc: "タスク定義の中の各コンテナの設定。イメージURI・ポート・環境変数・ログドライバーなどを指定します。" },
          { word: "awslogs", desc: "ECSコンテナのログをCloudWatch Logsに転送するログドライバー。コンテナのstdout/stderrが自動的に保存されます。" },
        ],
        console: [
          "AWSコンソール検索で「ECS」→左メニュー「タスク定義」→「新しいタスク定義の作成」",
          "タスク定義ファミリー: hello-world-task",
          "起動タイプ: AWS Fargate",
          "CPU: 0.25 vCPU、メモリ: 0.5 GB",
          "タスクロール: ecsTaskExecutionRole（なければ自動作成）",
          "コンテナ-1: 名前 hello-world、イメージURI: ECRのイメージURI",
          "コンテナポート: 80（TCP）",
          "ログ収集: 「CloudWatch Logs使用」にチェック",
          "「作成」をクリック",
        ],
        code: `# タスク実行ロールのARNを取得（存在しない場合は先に作成）
EXECUTION_ROLE_ARN=$(aws iam get-role \\
  --role-name ecsTaskExecutionRole \\
  --query 'Role.Arn' --output text 2>/dev/null)

if [ -z "$EXECUTION_ROLE_ARN" ]; then
  # タスク実行ロールを作成
  aws iam create-role \\
    --role-name ecsTaskExecutionRole \\
    --assume-role-policy-document '{
      "Version":"2012-10-17",
      "Statement":[{
        "Effect":"Allow",
        "Principal":{"Service":"ecs-tasks.amazonaws.com"},
        "Action":"sts:AssumeRole"
      }]
    }'
  aws iam attach-role-policy \\
    --role-name ecsTaskExecutionRole \\
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
  EXECUTION_ROLE_ARN=$(aws iam get-role --role-name ecsTaskExecutionRole --query 'Role.Arn' --output text)
fi

# CloudWatch Logsのロググループを作成
aws logs create-log-group --log-group-name /ecs/hello-world-task

# タスク定義を作成（JSON）
cat > task-definition.json << EOF
{
  "family": "hello-world-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "\${EXECUTION_ROLE_ARN}",
  "containerDefinitions": [{
    "name": "hello-world",
    "image": "\${ECR_URI}/my-hello-world:latest",
    "portMappings": [{"containerPort": 80, "protocol": "tcp"}],
    "essential": true,
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/hello-world-task",
        "awslogs-region": "\${REGION}",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }]
}
EOF

aws ecs register-task-definition \\
  --cli-input-json file://task-definition.json

echo "タスク定義の登録完了！"`,
        check: "ECSのタスク定義一覧に「hello-world-task」が表示されていますか？",
        point: "タスク定義は変更のたびにリビジョン（:1、:2…）が増えます。古いリビジョンはデプロイに使われませんが、ロールバック時に役立ちます。本番では環境変数を直接書かずにSSM Parameter StoreかSecrets Managerを参照します。",
      },
      {
        title: "ECSクラスターとサービスを作成する",
        emoji: "🏭", duration: "15分",
        what: "ECSクラスターはタスクを実行する「箱」です。クラスター内にサービスを作成するとタスクが起動します。サービスはタスク数の維持・ALBとの連携・ローリングデプロイなどを管理します。",
        terms: [
          { word: "ECSクラスター", desc: "ECSタスクを実行する論理的なグループ。Fargateではサーバー管理は不要で、クラスターは「名前の入れ物」のようなものです。" },
          { word: "ECSサービス", desc: "「常に2タスク動かし続ける」などタスク数を維持管理する仕組み。ALBとの統合・ローリングデプロイもここで設定します。" },
          { word: "awsvpc", desc: "ECSタスクがVPC内で独自のENI（ネットワークインターフェース）を持つネットワークモード。Fargateでは必須です。" },
        ],
        console: [
          "ECS左メニュー「クラスター」→「クラスターの作成」",
          "クラスター名: my-ecs-cluster、インフラストラクチャ: AWS Fargate",
          "「作成」をクリック",
          "クラスターを開いて「サービス」タブ→「作成」",
          "起動タイプ: FARGATE、タスク定義: hello-world-task（最新）",
          "サービス名: hello-world-service、タスクの数: 1",
          "VPC: my-first-vpc、サブネット: my-public-subnet",
          "セキュリティグループ: 新規作成（インバウンドHTTP 80を許可）",
          "パブリックIP: オン（今回はALBなしで直接アクセス）",
          "「作成」をクリック",
        ],
        code: `# ECSクラスターを作成
aws ecs create-cluster \\
  --cluster-name my-ecs-cluster \\
  --capacity-providers FARGATE \\
  --default-capacity-provider-strategy \\
    capacityProvider=FARGATE,weight=1

# ECS用セキュリティグループを作成
aws ec2 create-security-group \\
  --group-name ecs-fargate-sg \\
  --description "ECS Fargate SG" \\
  --vpc-id vpc-xxxxxxxxx

aws ec2 authorize-security-group-ingress \\
  --group-id sg-xxxxxxxxx \\
  --protocol tcp --port 80 --cidr 0.0.0.0/0

# ECSサービスを作成（ALBなし・パブリックIPあり）
aws ecs create-service \\
  --cluster my-ecs-cluster \\
  --service-name hello-world-service \\
  --task-definition hello-world-task \\
  --desired-count 1 \\
  --launch-type FARGATE \\
  --network-configuration '{
    "awsvpcConfiguration": {
      "subnets": ["subnet-xxxxxxxxx"],
      "securityGroups": ["sg-xxxxxxxxx"],
      "assignPublicIp": "ENABLED"
    }
  }'

# サービスが起動するまで待つ（1〜2分）
aws ecs wait services-stable \\
  --cluster my-ecs-cluster \\
  --services hello-world-service

# タスクのパブリックIPを取得
TASK_ARN=$(aws ecs list-tasks --cluster my-ecs-cluster --service-name hello-world-service --query 'taskArns[0]' --output text)
ENI_ID=$(aws ecs describe-tasks --cluster my-ecs-cluster --tasks $TASK_ARN --query 'tasks[0].attachments[0].details[?name==\`networkInterfaceId\`].value' --output text)
PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $ENI_ID --query 'NetworkInterfaces[0].Association.PublicIp' --output text)
echo "アクセスURL: http://$PUBLIC_IP"`,
        check: "ECSサービスのタスク数が「1/1 実行中」になっていますか？タスクのパブリックIPにブラウザでアクセスして表示されましたか？",
        point: "本番環境ではパブリックIPの直接割り当てではなく、ALB（Application Load Balancer）を前段に置きます。次のステップでALBと連携します。",
      },
      {
        title: "ALBを追加してサービスを公開する",
        emoji: "⚖️", duration: "15分",
        what: "ALB（Application Load Balancer）を追加することで、複数のFargateタスクへトラフィックを分散できます。タスクが再起動してIPが変わっても、ALBのDNS名でアクセスできます。",
        terms: [
          { word: "ALB", desc: "Application Load Balancer。HTTPリクエストをEC2やFargateタスクに分散するロードバランサー。パスやヘッダーでルーティングできます。" },
          { word: "ターゲットグループ", desc: "ALBがトラフィックを転送する先（EC2・Fargateタスクなど）のグループ。ヘルスチェックもここで設定します。" },
          { word: "リスナー", desc: "ALBがリクエストを受け付けるポートとプロトコルの設定。80番（HTTP）や443番（HTTPS）を設定します。" },
        ],
        console: [
          "EC2コンソール左メニュー「ロードバランサー」→「ロードバランサーの作成」→「Application Load Balancer」",
          "名前: hello-world-alb、スキーム: インターネット向け",
          "VPC: my-first-vpc、サブネット: 複数AZのパブリックサブネットを選択",
          "セキュリティグループ: HTTP80を許可したSGを選択",
          "ターゲットグループ: 新規作成→タイプ「IPアドレス」→名前: hello-world-tg→ポート80",
          "「ロードバランサーを作成」→ECSサービスを編集してALBを紐付け",
        ],
        code: `# ターゲットグループを作成（IPタイプ=Fargate用）
aws elbv2 create-target-group \\
  --name hello-world-tg \\
  --protocol HTTP --port 80 \\
  --vpc-id vpc-xxxxxxxxx \\
  --target-type ip \\
  --health-check-path / \\
  --health-check-interval-seconds 30

# ALBを作成
aws elbv2 create-load-balancer \\
  --name hello-world-alb \\
  --subnets subnet-public-1a subnet-public-1c \\
  --security-groups sg-alb-xxxxxxxxx \\
  --scheme internet-facing --type application

# リスナーを作成（80番ポート→ターゲットグループへ）
aws elbv2 create-listener \\
  --load-balancer-arn arn:aws:elasticloadbalancing:... \\
  --protocol HTTP --port 80 \\
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...

# ECSサービスをALB付きに更新
aws ecs update-service \\
  --cluster my-ecs-cluster \\
  --service hello-world-service \\
  --desired-count 2 \\
  --load-balancers "targetGroupArn=arn:...,containerName=hello-world,containerPort=80"

# ALBのDNS名を取得
aws elbv2 describe-load-balancers \\
  --names hello-world-alb \\
  --query 'LoadBalancers[0].DNSName' --output text`,
        check: "ALBのDNS名でブラウザにアクセスして「Hello ECS/Fargate!」が表示されましたか？タスク数を2に増やしてもアクセスできますか？",
        point: "ALBのヘルスチェックが失敗するとタスクが再起動ループに入ります。ヘルスチェックパスのレスポンスが200を返すか確認しましょう。ヘルスチェックの間隔を30秒・閾値を2回にするとデプロイが速くなります。",
      },
      {
        title: "CloudWatch Logsでログを確認する",
        emoji: "📊", duration: "5分",
        what: "Fargateではコンテナに直接SSHできないため、ログはCloudWatch Logsで確認します。タスク定義でawslogsドライバーを設定しておくと、コンテナのstdout/stderrが自動でCloudWatchに転送されます。",
        terms: [
          { word: "CloudWatch Logs", desc: "AWSのログ集約サービス。ECSコンテナ・Lambda・EC2のログをまとめて保管・検索・アラートできます。" },
          { word: "ロググループ", desc: "CloudWatch Logsのログの集まり。/ecs/タスク定義名 のように命名するのが一般的です。" },
          { word: "ログストリーム", desc: "ロググループ内の実際のログが流れるストリーム。ECSでは各タスクIDごとにストリームが作られます。" },
        ],
        console: [
          "AWSコンソール検索で「CloudWatch」→左メニュー「ロググループ」",
          "「/ecs/hello-world-task」をクリック",
          "最新のログストリームをクリック",
          "nginxのアクセスログが表示されることを確認",
          "「ログのインサイト」でクエリを実行してみる",
        ],
        code: `# ロググループのログストリーム一覧を確認
aws logs describe-log-streams \\
  --log-group-name /ecs/hello-world-task \\
  --order-by LastEventTime \\
  --descending \\
  --max-items 5 \\
  --query 'logStreams[*].logStreamName'

# 最新のログを取得
STREAM=$(aws logs describe-log-streams \\
  --log-group-name /ecs/hello-world-task \\
  --order-by LastEventTime --descending \\
  --query 'logStreams[0].logStreamName' --output text)

aws logs get-log-events \\
  --log-group-name /ecs/hello-world-task \\
  --log-stream-name $STREAM \\
  --limit 20 \\
  --query 'events[*].message' --output text

# CloudWatch Logsインサイト（過去1時間のエラーを検索）
aws logs start-query \\
  --log-group-name /ecs/hello-world-task \\
  --start-time $(date -d '1 hour ago' +%s) \\
  --end-time $(date +%s) \\
  --query-string 'fields @timestamp, @message | filter @message like /error/ | sort @timestamp desc | limit 20'`,
        check: "CloudWatch Logsにnginxのアクセスログが表示されていますか？",
        point: "Fargateではコンテナへのsshが原則できません（ECS Exec機能を使えば可能）。ログ設計が特に重要です。本番では構造化ログ（JSON形式）でアプリログを出力し、CloudWatch Logsインサイトで効率よく分析できるようにしましょう。",
      },
    ],
  },

  /* ───────────────── CloudFront ───────────────── */
  {
    id: "cloudfront",
    title: "CloudFront / S3 / ALB",
    emoji: "🌍",
    color: "#f97316",
    lightColor: "#fff7ed",
    borderColor: "#fed7aa",
    duration: "60分",
    difficulty: "⭐⭐⭐",
    arch: ArchCF,
    steps: [
      {
        title: "S3オリジンを準備する（OACで非公開配信）",
        emoji: "🪣", duration: "10分",
        what: "CloudFrontはCDN（コンテンツ配信ネットワーク）です。S3を直接公開せず、CloudFront経由のみアクセスさせる「OAC（Origin Access Control）」パターンが現在の推奨です。S3はプライベートのまま保ちます。",
        terms: [
          { word: "CDN", desc: "Content Delivery Network。世界中のエッジロケーション（AWS拠点）にコンテンツをキャッシュし、ユーザーに近い場所から高速配信する仕組み。" },
          { word: "OAC", desc: "Origin Access Control。CloudFrontのみがS3にアクセスできるよう制御する仕組み。旧OAIより強力でサポート範囲が広いです。" },
          { word: "オリジン", desc: "CloudFrontがコンテンツを取得する元のサーバー。S3・ALB・EC2・APIGatewayなどを設定できます。" },
          { word: "エッジロケーション", desc: "CloudFrontのキャッシュサーバーが設置された世界中の拠点。400以上存在し、ユーザーに最も近いロケーションから配信されます。" },
        ],
        console: [
          "S3バケットに静的ファイルをアップロード（S3ハンズオンで作成したバケットを使用）",
          "バケットの「パブリックアクセスのブロック」を全てON（非公開）に戻す",
          "バケットポリシーも削除する（CloudFrontからのみアクセス許可する新しいポリシーは後で設定）",
        ],
        code: `# 新しいS3バケットを作成（プライベート設定）
CF_BUCKET="my-cloudfront-site-$(date +%Y%m%d)"
aws s3api create-bucket \\
  --bucket $CF_BUCKET \\
  --region ap-northeast-1 \\
  --create-bucket-configuration LocationConstraint=ap-northeast-1

# パブリックアクセスを完全ブロック（デフォルト）
aws s3api put-public-access-block \\
  --bucket $CF_BUCKET \\
  --public-access-block-configuration \\
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# 静的ファイルをアップロード
cat > index.html << 'EOF'
<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8">
<title>Hello CloudFront!</title>
<style>body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;
height:100vh;margin:0;background:linear-gradient(135deg,#f97316,#ec4899);}
.card{background:white;border-radius:16px;padding:40px 60px;text-align:center;}
h1{color:#1a1a2e;font-size:2.5em;}p{color:#555;}</style></head>
<body><div class="card"><h1>🌍 Hello CloudFront!</h1>
<p>世界中から高速アクセス！</p></div></body></html>
EOF

aws s3 cp index.html s3://$CF_BUCKET/
echo "S3バケット準備完了: $CF_BUCKET"`,
        check: "S3バケットがプライベート（パブリックアクセスブロックON）の状態でファイルがアップロードされていますか？",
        point: "旧来の「S3を公開＋CloudFront」パターンから「S3を非公開＋OAC」パターンへの移行がAWS推奨です。S3への直接アクセスをブロックすることでセキュリティが向上します。",
      },
      {
        title: "CloudFrontディストリビューションを作成する",
        emoji: "🌍", duration: "15分",
        what: "CloudFrontディストリビューションを作成し、S3をオリジンとして設定します。OAC（Origin Access Control）を使ってCloudFrontからのみS3にアクセスできるよう設定します。",
        terms: [
          { word: "ディストリビューション", desc: "CloudFrontの設定単位。オリジン・キャッシュ設定・HTTPSなどをまとめた設定のセットです。ドメイン名（xxx.cloudfront.net）が割り当てられます。" },
          { word: "キャッシュビヘイビア", desc: "URLパターンに応じてキャッシュの設定を変える機能。/api/* はキャッシュしない、/* はキャッシュするなどを設定できます。" },
          { word: "TTL", desc: "Time To Live。キャッシュの有効期間。HTML（短め）と画像・CSS（長め）で分けて設定するのが一般的です。" },
        ],
        console: [
          "AWSコンソール検索で「CloudFront」→「ディストリビューションを作成」",
          "オリジンドメイン: 作成したS3バケットを選択（.s3.amazonaws.com のもの）",
          "「S3バケットへのアクセスを制限する」→「はい、OACを使用します」を選択",
          "「新しいOACを作成」→名前そのままで「作成」",
          "デフォルトルートオブジェクト: index.html",
          "「ディストリビューションを作成」をクリック",
          "「S3バケットポリシーをコピー」ボタンが表示されるのでコピーしてS3バケットポリシーに貼り付け",
        ],
        code: `# OACを作成
OAC_ID=$(aws cloudfront create-origin-access-control \\
  --origin-access-control-config '{
    "Name": "my-s3-oac",
    "Description": "OAC for S3",
    "SigningProtocol": "sigv4",
    "SigningBehavior": "always",
    "OriginAccessControlOriginType": "s3"
  }' --query 'OriginAccessControl.Id' --output text)

# CloudFrontディストリビューションを作成
DIST_ID=$(aws cloudfront create-distribution \\
  --distribution-config '{
    "Origins": {
      "Quantity": 1,
      "Items": [{
        "Id": "S3Origin",
        "DomainName": "'$CF_BUCKET'.s3.ap-northeast-1.amazonaws.com",
        "S3OriginConfig": {"OriginAccessIdentity": ""},
        "OriginAccessControlId": "'$OAC_ID'"
      }]
    },
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3Origin",
      "ViewerProtocolPolicy": "redirect-to-https",
      "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
      "Compress": true
    },
    "DefaultRootObject": "index.html",
    "Comment": "My CloudFront Distribution",
    "Enabled": true,
    "HttpVersion": "http2"
  }' --query 'Distribution.Id' --output text)

echo "DistributionId: $DIST_ID"

# S3バケットポリシーをCloudFrontからのアクセスのみ許可に更新
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
cat > cf-bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowCloudFrontServicePrincipal",
    "Effect": "Allow",
    "Principal": {"Service": "cloudfront.amazonaws.com"},
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::\${CF_BUCKET}/*",
    "Condition": {
      "StringEquals": {
        "AWS:SourceArn": "arn:aws:cloudfront::\${ACCOUNT_ID}:distribution/\${DIST_ID}"
      }
    }
  }]
}
EOF
aws s3api put-bucket-policy --bucket $CF_BUCKET --policy file://cf-bucket-policy.json`,
        check: "CloudFrontディストリビューションのステータスが「有効」になりましたか？（デプロイに5〜15分かかります）",
        point: "ディストリビューションのデプロイには最大15分かかります。ステータスが「デプロイ中」の間は設定変更しても反映が遅れます。CloudFront.netドメインにアクセスして表示されれば成功です。",
      },
      {
        title: "ALBをオリジンに追加する（動的コンテンツ）",
        emoji: "⚖️", duration: "15分",
        what: "CloudFrontはS3（静的）だけでなく、ALB（動的）もオリジンに追加できます。URLパスで振り分けることで「/api/* はALB、それ以外はS3」という構成が実現できます。",
        terms: [
          { word: "マルチオリジン", desc: "CloudFrontが複数のオリジンを持てる機能。パスパターンに応じてS3・ALB・APIGatewayなどに振り分けできます。" },
          { word: "カスタムヘッダー", desc: "CloudFrontからオリジンに送るカスタムHTTPヘッダー。ALBがCloudFront経由のリクエストのみ受け付けるホワイトリストとして使えます。" },
          { word: "キャッシュ無効化", desc: "CloudFrontのキャッシュを強制削除すること。S3を更新したのに古いコンテンツが配信される場合に実行します。（Invalidation）" },
        ],
        console: [
          "CloudFrontのディストリビューションを開く→「オリジン」タブ→「オリジンを作成」",
          "オリジンドメイン: ALBのDNS名を入力",
          "プロトコル: HTTP のみ（ALBがHTTPSを処理する場合はHTTPS）",
          "カスタムHTTPヘッダー: X-CloudFront-Secret: （ランダムな文字列）",
          "「オリジンを作成」をクリック",
          "「ビヘイビア」タブ→「ビヘイビアを作成」",
          "パスパターン: /api/*",
          "オリジン: ALBのオリジンを選択",
          "キャッシュポリシー: CachingDisabled（APIはキャッシュしない）",
          "「ビヘイビアを作成」をクリック",
        ],
        code: `# ALBオリジンを既存ディストリビューションに追加
# 1. 現在の設定を取得
aws cloudfront get-distribution-config \\
  --id $DIST_ID > dist-config-full.json

ETAG=$(cat dist-config-full.json | python3 -c "import sys,json; print(json.load(sys.stdin)['ETag'])")
cat dist-config-full.json | python3 -c "import sys,json; print(json.dumps(json.load(sys.stdin)['DistributionConfig'], indent=2))" > dist-config.json

# 2. ALBオリジンとキャッシュビヘイビアを追加（手動でdist-config.jsonを編集）
# Origins.Items に以下を追加:
cat << 'EOF'
{
  "Id": "ALBOrigin",
  "DomainName": "hello-world-alb-xxxx.ap-northeast-1.elb.amazonaws.com",
  "CustomOriginConfig": {
    "HTTPPort": 80,
    "HTTPSPort": 443,
    "OriginProtocolPolicy": "http-only"
  },
  "CustomHeaders": {
    "Quantity": 1,
    "Items": [{
      "HeaderName": "X-CloudFront-Secret",
      "HeaderValue": "your-secret-string-here"
    }]
  }
}
EOF

# CacheBehaviors.Items に /api/* パターンを追加:
cat << 'EOF'
{
  "PathPattern": "/api/*",
  "TargetOriginId": "ALBOrigin",
  "ViewerProtocolPolicy": "redirect-to-https",
  "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
  "Compress": true
}
EOF

# キャッシュを無効化（デプロイ後にコンテンツ更新した場合）
aws cloudfront create-invalidation \\
  --distribution-id $DIST_ID \\
  --paths "/*"

echo "ALBオリジン追加完了。ビヘイビア: /api/* → ALB, /* → S3"`,
        check: "CloudFrontのビヘイビア一覧に「/api/*→ALB」と「デフォルト→S3」の2つが表示されていますか？",
        point: "ALBにはCloudFrontからのリクエストのみ受け付けるよう、リスナールールで「X-CloudFront-Secretヘッダーが一致しないリクエストは403を返す」設定を追加することで直接アクセスを防げます。",
      },
      {
        title: "ACM証明書でHTTPS化する",
        emoji: "🔒", duration: "10分",
        what: "ACM（AWS Certificate Manager）で無料のSSL/TLS証明書を発行し、CloudFrontに設定してHTTPS化します。ACMの証明書は自動更新されるので管理の手間がありません。",
        terms: [
          { word: "ACM", desc: "AWS Certificate Manager。AWSが提供する無料のSSL/TLS証明書サービス。CloudFront・ALBで使える証明書を発行・自動更新します。" },
          { word: "SSL/TLS証明書", desc: "HTTPSに必要なデジタル証明書。通信の暗号化とサイトの信頼性を担保します。" },
          { word: "DNS検証", desc: "ACMが証明書発行時にドメイン所有権を確認する方法。Route 53を使うと自動検証ができます。" },
          { word: "us-east-1", desc: "CloudFrontに使うACM証明書は必ずus-east-1（バージニア北部）リージョンで発行する必要があります。重要！" },
        ],
        console: [
          "【重要】AWSコンソールのリージョンを「米国東部（バージニア北部）us-east-1」に変更",
          "「Certificate Manager（ACM）」→「証明書をリクエスト」",
          "パブリック証明書をリクエスト→「次へ」",
          "ドメイン名: example.com（自分のドメインがない場合はスキップ）",
          "検証方法: DNS検証",
          "「リクエスト」→「Route 53でレコードを作成」（Route 53使用時は自動）",
          "CloudFrontのディストリビューション設定→「代替ドメイン名（CNAME）」に独自ドメインを追加",
          "カスタムSSL証明書: 発行したACM証明書を選択",
          "Route 53にCloudFrontのDNS名をAliasレコードで登録",
        ],
        code: `# ⚠️ ACMはus-east-1リージョンで発行する必要があります
CERT_ARN=$(aws acm request-certificate \\
  --domain-name "example.com" \\
  --validation-method DNS \\
  --subject-alternative-names "www.example.com" \\
  --region us-east-1 \\
  --query 'CertificateArn' --output text)

# DNS検証レコードを確認（Route 53に手動またはCDKで追加）
aws acm describe-certificate \\
  --certificate-arn $CERT_ARN \\
  --region us-east-1 \\
  --query 'Certificate.DomainValidationOptions[*].{Domain:DomainName,Name:ResourceRecord.Name,Value:ResourceRecord.Value}'

# Route 53で自動的にDNS検証レコードを追加（Route 53ホストゾーン使用時）
aws acm wait certificate-validated \\
  --certificate-arn $CERT_ARN \\
  --region us-east-1

# CloudFrontのディストリビューション設定を更新（HTTPSと独自ドメイン）
# DistributionConfigのAliasesとViewerCertificateを更新
echo "証明書ARN: $CERT_ARN"
echo "CloudFrontの設定→カスタムSSL証明書に設定してください"`,
        check: "CloudFrontのディストリビューションにACM証明書が設定され、HTTPSでアクセスできますか？",
        point: "CloudFrontのACM証明書は必ずus-east-1リージョンで発行してください！東京リージョンで発行した証明書はCloudFrontに使えません。これはよくある詰まりポイントです。",
      },
      {
        title: "Route 53で独自ドメインを設定する",
        emoji: "🌐", duration: "10分",
        what: "Route 53はAWSのDNSサービスです。独自ドメインをCloudFrontに紐付けることで、https://example.com でWebサイトにアクセスできるようになります。",
        terms: [
          { word: "Route 53", desc: "AWSのDNSサービス。ドメイン登録・DNSルーティング・ヘルスチェックができます。名前の由来はDNSがポート53を使うことから。" },
          { word: "ホストゾーン", desc: "Route 53でドメインのDNSレコードを管理する場所。example.com のホストゾーンを作って各サービスのDNSレコードを登録します。" },
          { word: "Aliasレコード", desc: "AWSリソース（CloudFront・ALB・S3）をDNS名で指定するRoute 53独自の機能。Aレコードと違い、IPではなくDNS名を設定できます。" },
          { word: "TTL", desc: "DNSのキャッシュ時間。短すぎると毎回DNSを引くため遅くなり、長すぎると変更後の反映が遅くなります。300〜3600秒が一般的。" },
        ],
        console: [
          "Route 53でホストゾーンを作成（またはドメインを購入）",
          "ホストゾーンを開いて「レコードを作成」",
          "レコードタイプ: A、レコード名: （空白=ルートドメイン）",
          "「エイリアス」をON",
          "エイリアス先: 「CloudFrontディストリビューション」を選択",
          "対象のCloudFrontを選択して「レコードを作成」",
          "www.example.com 用のCNAMEレコードも追加（CloudFrontのDNS名を値に設定）",
        ],
        code: `# Route 53でホストゾーンを確認
aws route53 list-hosted-zones \\
  --query 'HostedZones[*].{Name:Name,Id:Id}'

# CloudFrontのDNS名を取得
CF_DOMAIN=$(aws cloudfront get-distribution \\
  --id $DIST_ID \\
  --query 'Distribution.DomainName' --output text)
echo "CloudFront Domain: $CF_DOMAIN"

# Route 53にAliasレコードを作成（example.com → CloudFront）
HOSTED_ZONE_ID="ZXXXXXXXXXXXXXXXXXXXX"  # 自分のホストゾーンIDに変更

aws route53 change-resource-record-sets \\
  --hosted-zone-id $HOSTED_ZONE_ID \\
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "example.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "'$CF_DOMAIN'",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'

# DNS反映確認（数分かかる場合あり）
dig example.com +short
curl -I https://example.com`,
        check: "https://example.com（または自分のドメイン）にアクセスして「Hello CloudFront!」が表示されましたか？🎉",
        point: "Route 53のAliasレコードはCloudFront・ALB・S3ウェブサイトエンドポイントに対してIPではなくDNS名で設定します。ALBはIPが変動するため、Aliasレコードが必須です。CloudFront向けAliasのHostedZoneIdは常にZ2FDTNDATAQYWQです。",
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════
   メインアプリ
═══════════════════════════════════════════════════════ */
export default function AdvancedCurriculum() {
  const [activeCourse, setActiveCourse] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const course = COURSES[activeCourse];
  const step = course.steps[activeStep];
  const courseKey = (ci, si) => `\${ci}-\${si}`;
  const isDone = (ci, si) => !!completed[courseKey(ci, si)];
  const totalDone = Object.keys(completed).length;
  const totalSteps = COURSES.reduce((a, c) => a + c.steps.length, 0);
  const courseDone = course.steps.filter((_, si) => isDone(activeCourse, si)).length;
  const Arch = course.arch;

  const complete = () => {
    setCompleted(prev => ({ ...prev, [courseKey(activeCourse, activeStep)]: true }));
    if (activeStep < course.steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Nunito','Hiragino Kaku Gothic ProN',sans-serif" }}>
      {/* ── HEADER ── */}
      <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)", padding: "18px 20px", color: "white" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
            <div style={{ fontSize: 28, width: 48, height: 48, background: "rgba(255,255,255,0.12)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>☁️</div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#93c5fd", textTransform: "uppercase" }}>AWS HANDS-ON CURRICULUM</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>S3 / IAM / ECS / CloudFront マスターコース</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#93c5fd" }}>総合進捗 {totalDone}/{totalSteps}</div>
              <div style={{ width: 140, height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 4, marginTop: 5, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `\${(totalDone / totalSteps) * 100}%`, background: "linear-gradient(90deg,#f97316,#a855f7)", transition: "width 0.5s" }} />
              </div>
            </div>
          </div>

          {/* course tabs */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
            {COURSES.map((c, i) => {
              const done = c.steps.filter((_, si) => isDone(i, si)).length;
              return (
                <button key={i} onClick={() => { setActiveCourse(i); setActiveStep(0); }}
                  style={{
                    padding: "8px 14px", borderRadius: 10, whiteSpace: "nowrap",
                    border: `2px solid \${activeCourse === i ? c.color : "rgba(255,255,255,0.1)"}`,
                    background: activeCourse === i ? `\${c.color}22` : "transparent",
                    color: activeCourse === i ? "white" : "rgba(255,255,255,0.45)",
                    cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700,
                    boxShadow: activeCourse === i ? `0 0 12px \${c.color}50` : "none",
                    transition: "all 0.2s",
                  }}>
                  {c.emoji} {c.title}
                  <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.7 }}>{done}/{c.steps.length}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "16px 14px" }}>
        {/* course meta */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          {[
            ["⏱ 所要時間", course.duration],
            ["📊 難易度", course.difficulty],
            ["✅ 進捗", `\${courseDone}/\${course.steps.length} ステップ`],
          ].map(([k, v]) => (
            <div key={k} style={{ background: "white", border: `2px solid \${course.borderColor}`, borderRadius: 8, padding: "6px 14px", fontSize: 12 }}>
              <span style={{ color: "#94a3b8" }}>{k}: </span>
              <span style={{ fontWeight: 700, color: course.color }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {/* left nav */}
          <div style={{ width: 200, flexShrink: 0 }}>
            {course.steps.map((s, i) => (
              <button key={i} onClick={() => setActiveStep(i)}
                style={{
                  width: "100%", textAlign: "left", padding: "9px 11px", marginBottom: 5,
                  borderRadius: 9, fontFamily: "inherit",
                  border: `2px solid \${i === activeStep ? course.color : isDone(activeCourse, i) ? "#22c55e" : "#e2e8f0"}`,
                  background: i === activeStep ? course.lightColor : isDone(activeCourse, i) ? "#f0fdf4" : "white",
                  cursor: "pointer", transition: "all 0.2s",
                }}>
                <div style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{isDone(activeCourse, i) ? "✅" : s.emoji}</span>
                  <div>
                    <div style={{ fontSize: 10, color: i === activeStep ? course.color : isDone(activeCourse, i) ? "#16a34a" : "#94a3b8", fontWeight: 700 }}>Step {i + 1}</div>
                    <div style={{ fontSize: 11, color: i === activeStep ? "#1e293b" : "#475569", lineHeight: 1.3, fontWeight: i === activeStep ? 700 : 400 }}>{s.title}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>⏱ {s.duration}</div>
                  </div>
                </div>
              </button>
            ))}

            {/* completion */}
            {courseDone === course.steps.length && (
              <div style={{ marginTop: 10, background: "#f0fdf4", border: "2px solid #22c55e", borderRadius: 9, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 20 }}>🎉</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#15803d" }}>{course.title}<br />完了！</div>
              </div>
            )}
          </div>

          {/* main */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Arch step={activeStep} />
            <StepCard
              step={step}
              color={course.color}
              lightColor={course.lightColor}
              borderColor={course.borderColor}
              emoji={step.emoji}
              stepNum={activeStep + 1}
              totalSteps={course.steps.length}
              isCompleted={isDone(activeCourse, activeStep)}
              onComplete={complete}
              onPrev={() => activeStep > 0 && setActiveStep(activeStep - 1)}
              showPrev={activeStep > 0}
              isLast={activeStep === course.steps.length - 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
