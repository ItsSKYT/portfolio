"use client";

import { useEffect, useState } from "react";
import { cx, vars } from "@/lib/cx";
import { Reveal } from "../skyt/Motion";

type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

type Data = {
  repos: number;
  followers: number;
  stars: number;
  since: number;
  languages: { name: string; share: number }[];
  recent: Repo[];
};

const CACHE_KEY = "skyt-github";
const CACHE_MS = 10 * 60 * 1000;

const rtf = new Intl.RelativeTimeFormat("pl", { numeric: "auto" });
function ago(iso: string) {
  const days = Math.round((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (Math.abs(days) < 1) return "dziś";
  if (Math.abs(days) < 30) return rtf.format(days, "day");
  if (Math.abs(days) < 365) return rtf.format(Math.round(days / 30), "month");
  return rtf.format(Math.round(days / 365), "year");
}

async function load(user: string): Promise<Data> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? "null");
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.data;
  } catch {
    // No cache: fetch below.
  }
  const [profile, repos] = await Promise.all([
    fetch(`https://api.github.com/users/${user}`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
    fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=100`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
  ]);
  // Own work only: no forks, no archived repos, no profile README repo.
  const own = (repos as Repo[]).filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== user.toLowerCase());
  const counts = new Map<string, number>();
  for (const r of own) if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  const data: Data = {
    repos: profile.public_repos,
    followers: profile.followers,
    stars: own.reduce((s, r) => s + r.stargazers_count, 0),
    since: new Date(profile.created_at).getFullYear(),
    languages: [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, n]) => ({ name, share: total ? n / total : 0 })),
    recent: own.slice(0, 3),
  };
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    // Storage full or blocked: fine, next visit fetches again.
  }
  return data;
}

/** Live public GitHub: totals, language split and the most recently pushed own repos. */
export function GitHubActivity({ user }: { user: string }) {
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    load(user)
      .then((d) => !cancelled && setData(d))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [user]);

  const profileUrl = `https://github.com/${user}`;

  return (
    <div className={cx("gh", !data && !failed && "is-loading")} aria-busy={!data && !failed}>
      <div className="gh__head">
        <div>
          <p className="gh__eyebrow">GitHub / na żywo</p>
          <a className="gh__user sk-link" href={profileUrl} target="_blank" rel="noopener noreferrer">
            @{user}
          </a>
        </div>
        {data && (
          <dl className="gh__stats">
            <div>
              <dt>Repozytoria</dt>
              <dd>{data.repos}</dd>
            </div>
            <div>
              <dt>Gwiazdki</dt>
              <dd>{data.stars}</dd>
            </div>
            <div>
              <dt>Obserwujący</dt>
              <dd>{data.followers}</dd>
            </div>
            <div>
              <dt>Od</dt>
              <dd>{data.since}</dd>
            </div>
          </dl>
        )}
      </div>

      {data && data.languages.length > 0 && (
        <div className="gh__langs">
          <div className="gh__bar" role="img" aria-label={data.languages.map((l) => `${l.name} ${Math.round(l.share * 100)}%`).join(", ")}>
            {data.languages.map((l, i) => (
              <span key={l.name} className={`gh__seg gh__seg--${i % 4}`} style={vars({ "--w": l.share, "--i": i })} />
            ))}
          </div>
          <ul className="gh__legend">
            {data.languages.map((l, i) => (
              <li key={l.name}>
                <span className={`gh__swatch gh__seg--${i % 4}`} aria-hidden="true" />
                {l.name} <span>{Math.round(l.share * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data ? (
        <ul className="gh__repos">
          {data.recent.map((r, i) => (
            <Reveal as="li" key={r.name} delay={i * 90}>
              <a className="gh__repo" href={r.html_url} target="_blank" rel="noopener noreferrer" data-cursor="Repo">
                <span className="gh__repo-top">
                  <span className="gh__repo-name">{r.name}</span>
                  <span className="gh__repo-arrow" aria-hidden="true">
                    ↗
                  </span>
                </span>
                {r.description && <span className="gh__repo-desc">{r.description}</span>}
                <span className="gh__repo-meta">
                  {r.language && <span>{r.language}</span>}
                  <span>★ {r.stargazers_count}</span>
                  <span>{ago(r.pushed_at)}</span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      ) : failed ? (
        <p className="gh__fail">
          GitHub chwilowo nie odpowiada.{" "}
          <a className="sk-link sk-link--sky" href={profileUrl} target="_blank" rel="noopener noreferrer">
            Zobacz profil
          </a>
          .
        </p>
      ) : (
        <ul className="gh__repos" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="gh__repo gh__repo--skeleton dc-shimmer" />
          ))}
        </ul>
      )}
    </div>
  );
}
