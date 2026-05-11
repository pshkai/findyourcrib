import Container from "./container";

export default function Footer() {
  return (
    <footer className="border-t py-10">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              FYC
            </h2>

            <p className="text-sm text-muted-foreground">
              Trusted property discovery platform.
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            © 2026 FYC. All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
}