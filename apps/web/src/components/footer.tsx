function Footer() {
    return ( <footer className=" flex flex-row fixed bottom-2 left-2 text-xs text-muted-foreground">
        <a
            href="/WARRANTY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
        >
            Warranty & Liability
        </a>
         &nbsp;|
        <a
            href="https://github.com/Qwertuhh/toci-alpha"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 hover:underline hover:text-primary">
            Alpha Version 1.0
        </a>
    </footer>);
}

export default Footer;