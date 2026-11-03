import { Button } from "@/components/skyt";
import { site } from "@/content/site";

export const metadata = { title: "404: Nie znaleziono" };

export default function NotFound() {
  return (
    <main className="nf">
      <div className="nf__top">
        <span>{site.name}</span>
        <span>Błąd 404</span>
      </div>
      <div>
        <h1 className="nf__num">
          4<span>0</span>4
        </h1>
        <div className="nf__row">
          <p className="body-l">Ta strona nie istnieje albo została przeniesiona.</p>
          <Button href="/" variant="ghost">
            Wróć na stronę główną
          </Button>
        </div>
      </div>
    </main>
  );
}
