import { asset } from "$fresh/runtime.ts";
import { effect, signal } from "@preact/signals";
import ConfettiExplosion from "react-confetti-explosion";

const showConfetti = signal("not initiated");

const largeConfettiProps = {
  force: 0.8,
  duration: 3000,
  particleCount: 300,
  width: 1600,
  colors: ["#041E43", "#1471BF", "#5BB4DC", "#FC027B", "#66D805"],
};

function Link({ children, href }) {
  return <a class="text-blue-500" target="_blank" href={href}>{children}</a>;
}

export default function Footer() {
  return (
    <>
      <footer class="px-4 py-2 gap-4 w-full text-xs italic flex justify-between items-end">
        <div>
          {showConfetti.value === "not initiated" && (
            <button
              onClick={() => showConfetti.value = "running"}
              type="button"
            >
              <img
                class="w-24"
                srcset="https://cdn.cafecito.app/imgs/buttons/button_5.png 1x, https://cdn.cafecito.app/imgs/buttons/button_5_2x.png 2x, https://cdn.cafecito.app/imgs/buttons/button_5_3.75x.png 3.75x"
                src="https://cdn.cafecito.app/imgs/buttons/button_5.png"
                alt="Invitame un café en cafecito.app"
              />
            </button>
          )}
          {showConfetti.value === "running" && (
            <>
              <ConfettiExplosion {...largeConfettiProps} />
              <div>
                Gracias! Pero guarda el café para el viaje.
              </div>
              <div>
                Podés encontrarme en{" "}
                <Link href="https://twitter.com/mciparelli">@mciparelli</Link>
                {" "}
                o compartir en el{" "}
                <Link href="https://t.me/+3JRDTJIf2gM0YWE5">
                  grupo de Telegram
                </Link>. O bien dale las gracias a{" "}
                <Link href="https://twitter.com/juanidambrosio">
                  @juanidambrosio
                </Link>{" "}
                que me inspiró para crear esta web.
              </div>
            </>
          )}
        </div>
        <a
          href="https://github.com/mciparelli/smiles-search"
          target="_blank"
          class="flex-shrink-0"
        >
          <img width={36} src="/github-mark.svg" />
        </a>
      </footer>
    </>
  );
}
