import { Package2 } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex flex-col items-center justify-between gap-4 py-2 md:h-16 md:flex-row md:py-0 max-w-screen-2xl">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Package2 className="h-4 w-4" />
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
            >
              DocSearch+ Team
            </a>
            . The source code is available on{" "}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};
