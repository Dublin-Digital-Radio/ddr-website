"use client";

import { useEffect, useState } from "react";
import Slider from "react-slick";

const settings = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export function Carousel() {
  const [posters, setPosters] = useState<any[]>();
  useEffect(() => {
    (async () => {
      const now = new Date().toISOString();
      const fetchedPosters = await fetch(
        `https://ddr-cms.fly.dev/api/posters?filters[active][$eq]=true&filters[displayUntil][$gte]=${now}&filters[displayFrom][$lte]=${now}&populate=*`
      )
        .then((response) => response.json())
        .then(({ data }) => {
          return data.map((node: { attributes: any }) => node.attributes);
        });
      setPosters(fetchedPosters);
    })();
  }, []);
  return (
    <>
      <Slider {...settings}>
        {posters?.map((poster) => (
          <div key={poster.image.data.attributes.url}>
            <img src={poster.image.data.attributes.url} />
          </div>
        ))}{" "}
      </Slider>
    </>
  );
}
