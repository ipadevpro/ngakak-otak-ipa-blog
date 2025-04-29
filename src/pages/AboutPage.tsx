
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Tentang Ngakak Otak IPA</h1>
          
          <div className="prose prose-lg">
            <p>
              <span className="text-theme-purple font-bold">Ngakak Otak IPA</span> adalah web blog edukatif yang menggabungkan 
              pengetahuan IPA SMP dengan gaya narasi kocak ala Raditya Dika.
            </p>
            
            <p>
              Kami percaya belajar nggak harus membosankan. Dengan storytelling yang receh, jujur, dan sedikit absurd, 
              kami berusaha menanamkan konsep IPA ke kepala Gen Z lewat bacaan yang relate dan fun.
            </p>
            
            <h2>Kenapa Kami Ada?</h2>
            
            <p>
              Buat jawab pertanyaan: <em>"Kenapa sih belajar IPA ngebosenin banget?"</em>
            </p>
            
            <p>
              Ternyata, otak kita lebih gampang nyimpen informasi ketika dikemas dalam bentuk cerita, apalagi cerita yang bikin ketawa.
              Jadi, daripada hafalan rumus yang bikin pusing, mending baca cerita kocak yang diam-diam nyisipin konsep IPA ke otak lo.
            </p>
            
            <h2>Siapa Target Kami?</h2>
            
            <ul>
              <li>Siswa SMP kelas 7–9 yang bosen sama buku paket</li>
              <li>Guru IPA kreatif yang pengen referensi cerita lucu + edukatif</li>
              <li>Orang tua yang pengen anaknya belajar dengan cara yang beda</li>
            </ul>
            
            <h2>Cara Pake Web Ini</h2>
            
            <ol>
              <li>Pilih topik IPA yang lo mau pelajari (atau yang keluar di ujian besok)</li>
              <li>Baca ceritanya sambil ketawa-ketawa</li>
              <li>Cek "Pelajaran IPA yang diselipin" untuk rangkuman konsep penting</li>
              <li>Voila! Sekarang lo udah belajar IPA tanpa sadar</li>
            </ol>
            
            <p className="text-muted-foreground italic">
              "Kalo nggak ketawa, berarti lo belum paham fisikanya. Atau mungkin selera humor lo aja yang ketinggian." — Tim Ngakak Otak IPA
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
