import styled from "styled-components";
import { FC, ReactNode, useEffect, useRef, useState } from "react";

interface Props {
  imageUrl?: string;
  children: ReactNode;
}

const FadeBackground: FC<Props> = ({ imageUrl, children }) => {
  const [currentImage, setCurrentImage] = useState<string | undefined>();
  const [nextImage, setNextImage] = useState<string | undefined>();
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!imageUrl || imageUrl === currentImage) return;

    // ⚡ Начинаем fade
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      setNextImage(imageUrl);
      setIsFading(true);

      setTimeout(() => {
        setCurrentImage(imageUrl);
        setNextImage(undefined);
        setIsFading(false);
      }, 600); // длительность fade
    };
  }, [imageUrl, currentImage]);

  return (
    <Wrapper>
      {currentImage && <ImageLayer image={currentImage} />}
      {nextImage && <ImageLayer image={nextImage} fadeIn />}
      <Content>{children}</Content>
    </Wrapper>
  );
};

export default FadeBackground;

const Wrapper = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`;

const ImageLayer = styled.div<{
  image: string;
  fadeIn?: boolean;
}>`
  position: absolute;
  inset: 0;
  z-index: 0;
  background: url(${(p) => p.image}) center/cover no-repeat;
  opacity: ${(p) => (p.fadeIn ? 0 : 1)};
  animation: ${(p) => (p.fadeIn ? "fadeIn 0.6s ease-in-out forwards" : "none")};

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: start;
`;
