"use client";

import Image from "next/image";

export function LogoIcon(props: { className?: string; width: number; height: number }) {
  const { className } = props;

  return (
    <picture className={`${className}`}>
      <Image
        src="/sample/AutoChainLogo.png"
        alt="AutoChain Logo"
        width={props.width}
        height={props.height}
        priority
      />
    </picture>
  );
}

export function MetaMaskIcon(props: { width: number; height: number }) {
  return (
    <picture>
      <img
        alt="Metamask Icon"
        src="/sample/MetaMask-icon.svg"
        width={props.width}
        height={props.height}
      />
    </picture>
  );
}
