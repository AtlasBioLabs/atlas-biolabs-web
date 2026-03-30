"use client";
/* eslint-disable react-hooks/static-components */

import Image from "next/image";
import Link from "next/link";
import { getMDXComponent } from "next-contentlayer2/hooks";
import {
  Children,
  isValidElement,
  useMemo,
  type ComponentPropsWithoutRef,
} from "react";

type MdxContentProps = {
  code: string;
};

function MdxAnchor(props: ComponentPropsWithoutRef<"a">) {
  const href = props.href ?? "";
  const isInternal = href.startsWith("/");

  if (isInternal) {
    return (
      <Link href={href} className="font-medium text-[var(--brand-blue)] underline-offset-2 hover:underline">
        {props.children}
      </Link>
    );
  }

  return (
    <a
      {...props}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-[var(--brand-blue)] underline-offset-2 hover:underline"
    />
  );
}

function MdxImage(props: ComponentPropsWithoutRef<"img">) {
  const src = typeof props.src === "string" ? props.src : "";
  const alt = props.alt ?? "";

  if (!src) {
    return null;
  }

  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-border/70 bg-[#eef4ff]">
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 48rem"
        />
      </div>
      {alt ? (
        <figcaption className="border-t border-border/70 bg-white px-4 py-3 text-sm text-muted-foreground">
          {alt}
        </figcaption>
      ) : null}
    </figure>
  );
}

function MdxParagraph(props: ComponentPropsWithoutRef<"p">) {
  const children = Children.toArray(props.children).filter(Boolean);

  if (children.length === 1) {
    const onlyChild = children[0];

    if (
      isValidElement(onlyChild) &&
      (onlyChild.type === MdxImage ||
        (typeof onlyChild.props === "object" &&
          onlyChild.props !== null &&
          "src" in onlyChild.props))
    ) {
      return <>{onlyChild}</>;
    }
  }

  return <p {...props} />;
}

const mdxComponents = {
  a: MdxAnchor,
  img: MdxImage,
  p: MdxParagraph,
};

export function MdxContent({ code }: MdxContentProps) {
  const Content = useMemo(() => getMDXComponent(code), [code]);

  return (
    <div className="mdx-content">
      <Content components={mdxComponents} />
    </div>
  );
}
