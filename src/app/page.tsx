import Link from "next/link";

const challenges = [
  "Menang 34 laga tanpa seri",
  "Juara tanpa kalah",
  "Bangun XI semua pemain lokal",
  "Draft hanya dari era 2017-2020",
  "Menang mode Hard tanpa melihat rating",
  "Buat XI dari sebanyak mungkin klub berbeda",
];

const faqs = [
  {
    question: "Apa itu 34-0 Indonesia?",
    answer:
      "34-0 Indonesia adalah game fan-made draft XI sepakbola Indonesia. Kamu memilih pemain dari klub dan musim berbeda, lalu mensimulasikan satu musim liga penuh.",
  },
  {
    question: "Kenapa targetnya 34-0?",
    answer:
      "Format liga 18 tim biasanya berarti 34 pertandingan home-away. Target sempurnanya adalah memenangkan semua laga.",
  },
  {
    question: "Apakah ini game resmi Liga Indonesia?",
    answer:
      "Bukan. Ini proyek fan draft game independen dan tidak berafiliasi dengan liga, klub, sponsor, atau pemilik hak resmi.",
  },
  {
    question: "Pemain dari musim apa saja?",
    answer:
      "Rancangannya mencakup periode Liga 1/Super League Indonesia 2017 sampai 2026. Database pemain sedang dilengkapi bertahap dari sumber yang bisa diverifikasi.",
  },
  {
    question: "Apa beda mode Normal dan Hard?",
    answer:
      "Mode Normal menampilkan rating saat draft. Mode Hard menyembunyikan rating sampai simulasi selesai.",
  },
  {
    question: "Rating pemain berasal dari mana?",
    answer:
      "Saat ini rating awal dibuat sebagai model internal untuk gameplay. Nantinya bisa ditingkatkan memakai statistik resmi atau dataset terverifikasi.",
  },
];

export default function Home() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="hero-field" aria-hidden="true">
          <div className="hero-center-circle" />
          <div className="hero-red-white" />
        </div>

        <div className="hero-content">
          <span className="fan-badge">Game draft fan-made Indonesia</span>
          <h1>
            34<span>-</span>0
          </h1>
          <p className="hero-subtitle">
            Bangun XI terbaik dari sepakbola Indonesia. Spin klub dan musim, draft pemain, lalu kejar musim sempurna.
          </p>
          <p className="hero-note">
            Dari era Liga 1 2017 sampai Super League 2026. Bisa menang semua 34 pertandingan?
          </p>
          <div className="hero-actions">
            <Link className="landing-primary" href="/game">
              Mulai Run Baru →
            </Link>
            <Link className="landing-secondary" href="/game">
              Lanjutkan Draft
            </Link>
          </div>
          <div className="hero-stats" aria-label="Ringkasan game">
            <div>
              <strong>18</strong>
              <span>Klub per musim</span>
            </div>
            <div>
              <strong>2017-2026</strong>
              <span>Periode draft</span>
            </div>
            <div>
              <strong>34</strong>
              <span>Laga simulasi</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <h2>Apa itu 34-0 Indonesia?</h2>
        <div className="copy-stack">
          <p>
            34-0 Indonesia adalah game draft XI berbasis web untuk penggemar sepakbola Indonesia. Kamu membuat skuad dari
            pemain berbagai klub dan musim, lalu mengadu tim itu melawan klub liga musim terbaru.
          </p>
          <p>
            Setiap spin membuka kombinasi klub, musim, dan aturan draft. Pilih pemain terbaik untuk formasi kamu, jaga
            keseimbangan posisi, dan lihat apakah skuadmu cukup kuat untuk menembus musim tanpa kalah.
          </p>
          <p>
            Nuansanya dibuat untuk nostalgia bola lokal: transfer mengejutkan, pemain asing kultus, talenta muda,
            stadion penuh tekanan, dan debat abadi soal siapa yang paling layak masuk XI.
          </p>
        </div>
      </section>

      <section className="landing-section">
        <h2>Cara main</h2>
        <div className="steps-list">
          <Step number="1" title="Atur run" text="Pilih formasi, mode rating, dan aturan spin sebelum masuk ke draft." />
          <Step number="2" title="Spin wheel" text="Wheel memilih klub dan musim dari periode Liga Indonesia 2017-2026." />
          <Step number="3" title="Draft pemain" text="Ambil satu pemain yang cocok dengan formasi dan strategi skuadmu." />
          <Step number="4" title="Simulasikan musim" text="Setelah XI lengkap, mainkan 34 laga dan kejar rekor sempurna." />
        </div>
      </section>

      <section className="landing-section">
        <h2>Challenge populer</h2>
        <div className="challenge-grid">
          {challenges.map((challenge) => (
            <div className="challenge-item" key={challenge}>
              <span>›</span>
              {challenge}
            </div>
          ))}
        </div>
      </section>

      <section className="media-card">
        <p className="eyebrow">Cerita bola lokal</p>
        <h2>Dari Bandung sampai Biak, dari Jakarta sampai Makassar.</h2>
        <p>
          Draft ini dirancang untuk merayakan keragaman sepakbola Indonesia: klub besar, kuda hitam, pemain muda,
          rekrutan asing, dan momen liga yang bikin diskusi tidak pernah selesai.
        </p>
      </section>

      <section className="landing-section">
        <h2>Pertanyaan umum</h2>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details className="faq-item" key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <h2>Siap membangun XI terbaik Indonesia?</h2>
        <p>Mulai draft, susun formasi, dan lihat apakah timmu bisa menyapu bersih 34 pertandingan.</p>
        <Link className="landing-primary" href="/game">
          Mainkan 34-0 →
        </Link>
      </section>

      <footer className="landing-footer">
        <nav>
          <Link href="/">Beranda</Link>
          <Link href="/game">Main</Link>
        </nav>
        <p>
          34-0 Indonesia adalah proyek fan-made independen. Tidak memakai logo resmi klub atau liga dan tidak berafiliasi
          dengan organisasi sepakbola mana pun.
        </p>
      </footer>
    </main>
  );
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="step-item">
      <span>{number}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}
