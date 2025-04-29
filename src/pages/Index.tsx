
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Beaker, ChevronRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-12 pb-12 md:pt-20 md:pb-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4 animate-bounce-small">
                <Beaker className="h-8 w-8 text-theme-purple" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter">
                Belajar IPA tapi ngakak? <span className="text-theme-purple">Gass pol</span> 🧪🤣
              </h1>
              <p className="max-w-[700px] text-lg text-muted-foreground">
                Kumpulan cerita receh ala Raditya Dika yang bikin lo nyerap materi IPA tanpa sadar. Dijamin ngestuck di otak!
              </p>
              <Button asChild size="lg" className="mt-4 animate-fade-in">
                <Link to="/topics">
                  Mulai Baca Ceritanya
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="bg-muted py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 md:gap-12 lg:grid-cols-3">
              <div className="rounded-xl bg-background p-6 shadow-sm">
                <div className="mb-4 text-4xl">🧠</div>
                <h3 className="text-xl font-bold">Konsep IPA</h3>
                <p className="text-muted-foreground">Materi IPA SMP yang bikin pusing, dibikin cerita yang bikin lo paham konsepnya.</p>
              </div>
              <div className="rounded-xl bg-background p-6 shadow-sm">
                <div className="mb-4 text-4xl">🤣</div>
                <h3 className="text-xl font-bold">Gaya Narasi Lucu</h3>
                <p className="text-muted-foreground">Receh banget ditulis ala Raditya Dika yang suka ngomongin hal random, dijamin bikin ketawa.</p>
              </div>
              <div className="rounded-xl bg-background p-6 shadow-sm">
                <div className="mb-4 text-4xl">📱</div>
                <h3 className="text-xl font-bold">Mobile First</h3>
                <p className="text-muted-foreground">Lo bisa baca dimana aja, kapan aja, sambil tiduran pun tetap mantul paham materinya.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sample stories teaser */}
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Cerita Populer</h2>
              <p className="mt-4 text-muted-foreground">
                Scroll aja dulu, siapa tahu relate sama hidup kamu 🫠
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              <div className="rounded-xl border bg-card p-6">
                <h3 className="text-lg font-bold">Cinta di Atas Trolley: Sebuah Perjuangan Gaya Gesek</h3>
                <p className="mt-2 text-sm text-muted-foreground">Materi: Gaya dan Gerak – Hukum Newton 1</p>
                <p className="mt-4">
                  Jadi gini, gue ketemu cewek di supermarket. Dia dorongin trolley penuh mie instan, gue trolley penuh sayur. Terus trolley gue nabrak dia. Dan lo tau hukum fisika pertama? Benda diam akan tetep diam sampai ada gaya yang—
                </p>
                <Button variant="link" className="mt-4 p-0">Baca selengkapnya &rarr;</Button>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <h3 className="text-lg font-bold">Mengapa Hati Apalagi Isi Dompetku Seperti Gas Ideal</h3>
                <p className="mt-2 text-sm text-muted-foreground">Materi: Zat dan Perubahannya – Gas dan Tekanan</p>
                <p className="mt-4">
                  Lo pernah nggak, habis THR lebaran merasa hidup sempurna, tapi dua minggu kemudian lo melihat ke ATM dan ternyata saldo lo udah menyusut seperti gas dalam ruang terbuka? Ini erat kaitannya dengan konsep gas ideal yang—
                </p>
                <Button variant="link" className="mt-4 p-0">Baca selengkapnya &rarr;</Button>
              </div>
            </div>
            <div className="mt-10 flex justify-center">
              <Button asChild>
                <Link to="/topics">Lihat Semua Topik</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
