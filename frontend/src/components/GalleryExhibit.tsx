import React from "react";
import styled from "styled-components";
import { artworks } from "../data/artworks";

const generateArtworks = (artworks) => {
  const finalArtworks = [];
  while (finalArtworks.length < 10) {
    const randomIndex = Math.floor(Math.random() * artworks.length);
    finalArtworks.push(artworks[randomIndex]);
  }
  return finalArtworks;
};

const Card = () => {
  const artworkList = generateArtworks(artworks);

  return (
    <StyledWrapper>
      <div className="card-3d">
        {artworkList.map((artwork, index) => (
          <div key={index} className="card-item">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="art-image"
            />
            <p className="art-title">{artwork.title}</p>
          </div>
        ))}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;

  @keyframes autoRun3d {
    from {
      transform: perspective(600px) rotateY(-360deg);
    }
    to {
      transform: perspective(600px) rotateY(0deg);
    }
  }

  @keyframes animateBrightness {
    10% {
      filter: brightness(1);
    }
    50% {
      filter: brightness(0.2);
    }
    90% {
      filter: brightness(1);
    }
  }

  .card-3d {
    position: relative;
    width: 700px;
    height: 500px;
    transform-style: preserve-3d;
    transform: perspective(1400px);
    animation: autoRun3d 20s linear infinite;
    will-change: transform;
  }

  .card-item {
    position: absolute;
    width: 140px;
    height: 200px;
    background-color: rgb(199, 199, 199);
    border-radius: 0.75rem;
    top: 50%;
    left: 50%;
    transform-origin: center center;
    animation: animateBrightness 20s linear infinite;
    transition-duration: 200ms;
    will-change: transform, filter;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .art-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.75rem;
  }

  .art-title {
    font-size: 0.8rem;
    text-align: center;
    font-weight: bold;
    margin-top: 5px;
    position: absolute;
    top: 105%;
    width: 100%;
  }

  .card-3d:hover {
    animation-play-state: paused !important;
  }

  .card-3d:hover .card-item {
    animation-play-state: paused !important;
  }

  .card-item:nth-child(1) {
    transform: translate(-50%, -50%) rotateY(0deg) translateZ(350px);
    animation-delay: -0s;
  }
  .card-item:nth-child(2) {
    transform: translate(-50%, -50%) rotateY(36deg) translateZ(350px);
    animation-delay: -2s;
  }
  .card-item:nth-child(3) {
    transform: translate(-50%, -50%) rotateY(72deg) translateZ(350px);
    animation-delay: -4s;
  }
  .card-item:nth-child(4) {
    transform: translate(-50%, -50%) rotateY(108deg) translateZ(350px);
    animation-delay: -6s;
  }
  .card-item:nth-child(5) {
    transform: translate(-50%, -50%) rotateY(144deg) translateZ(350px);
    animation-delay: -8s;
  }
  .card-item:nth-child(6) {
    transform: translate(-50%, -50%) rotateY(180deg) translateZ(350px);
    animation-delay: -10s;
  }
  .card-item:nth-child(7) {
    transform: translate(-50%, -50%) rotateY(216deg) translateZ(350px);
    animation-delay: -12s;
  }
  .card-item:nth-child(8) {
    transform: translate(-50%, -50%) rotateY(252deg) translateZ(350px);
    animation-delay: -14s;
  }
  .card-item:nth-child(9) {
    transform: translate(-50%, -50%) rotateY(288deg) translateZ(350px);
    animation-delay: -16s;
  }
  .card-item:nth-child(10) {
    transform: translate(-50%, -50%) rotateY(324deg) translateZ(350px);
    animation-delay: -18s;
  }
`;

export default Card;