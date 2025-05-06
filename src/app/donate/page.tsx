import { faPatreon } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { PageContainer } from "@/components/page-container";

export default function Donate() {
  return (
    <PageContainer>
      <div className="h-60 lg:h-80">
        <iframe
          src="https://player.vimeo.com/video/234288938?color=ff4a4a&title=0&byline=0&portrait=0"
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
        />
      </div>
      <h1 className="text-3xl font-bold">Support</h1>
      <p className="pb-4">
        We want you to become part of ddr. and subscribe to our vision of what
        our online radio station can be. We want more music, more voices, and
        more events and for that we need your support. Whether it&apos;s a
        monthly subscription or a one-off payment, your help is vital in ddr.
        unleashing its full potential.
      </p>
      <div>
        <a
          href="https://www.patreon.com/bePatron?u=5566404"
          className="inline-block text-xl p-2 border border-white rounded-sm"
        >
          <FontAwesomeIcon icon={faPatreon} className="fa-fw" /> Become a
          member!
        </a>
      </div>
      <div className="p-2">
        <form
          action="https://www.paypal.com/donate"
          method="post"
          target="_top"
        >
          <input type="hidden" name="cmd" value="_donations" />
          <input
            type="hidden"
            name="business"
            value="info@dublindigitalradio.com"
          />
          <input type="hidden" name="currency_code" value="EUR" />
          <input
            type="image"
            src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
            name="submit"
            title="PayPal - The safer, easier way to pay online!"
            alt="Donate with PayPal button"
          />
          <img
            alt=""
            src="https://www.paypal.com/en_IE/i/scr/pixel.gif"
            width="1"
            height="1"
          />
        </form>
      </div>
    </PageContainer>
  );
}
