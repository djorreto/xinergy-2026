import Script from "next/script";

export const METRICOOL_HASH =
  process.env.NEXT_PUBLIC_METRICOOL_HASH ?? "caefbfbf6e94f2c32c963e33011835c";

export function Metricool() {
  if (!METRICOOL_HASH) return null;

  return (
    <Script id="metricool-tracker" strategy="afterInteractive">
      {`
        function loadScript(a){
          var b=document.getElementsByTagName("head")[0],
              c=document.createElement("script");
          c.type="text/javascript";
          c.src="https://tracker.metricool.com/resources/be.js";
          c.onreadystatechange=a;
          c.onload=a;
          b.appendChild(c);
        }
        loadScript(function(){
          beTracker.t({hash:"${METRICOOL_HASH}"});
        });
      `}
    </Script>
  );
}
