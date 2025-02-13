import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-3xl font-bold">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold">{children}</h3>,
    h4: ({ children }) => <h4 className="text-l font-bold">{children}</h4>,
    p: ({ children }) => <p className="pb-4">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-8 pb-4">{children}</ul>,
    a: ({ children, ...props }) => (
      <a className="underline" {...props}>
        {children}
      </a>
    ),
    ...components,
  };
}
