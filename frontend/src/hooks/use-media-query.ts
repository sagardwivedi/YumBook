import { useEffect, useState, useMemo } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  const mediaQueryList = useMemo(() => matchMedia(query), [query]);

  useEffect(() => {
    const updateMatch = () => setMatches(mediaQueryList.matches);

    updateMatch();

    mediaQueryList.addEventListener("change", updateMatch);

    return () => mediaQueryList.removeEventListener("change", updateMatch);
  }, [mediaQueryList]);

  return matches;
}
