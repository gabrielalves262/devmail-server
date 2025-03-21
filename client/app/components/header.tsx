// @ts-nocheck
import { ButtonInfo } from "./button-info";
import { ButtonTheme } from "./button-theme";

interface Props {
  theme: 'light' | 'dark',
  onSet: (theme: 'light' | 'dark' | 'system') => void
}

export const Header = ({ onSet, theme }: Props) => {
  return (
    <header className="flex w-full h-12 bg-background border-b border-border shadow-md">
      <div className="flex w-full items-center justify-between px-6">
        <div className="flex items-center gap-x-2">
          <svg className="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="13" x="6" y="4" rx="2" /><path d="m22 7-7.1 3.78c-.57.3-1.23.3-1.8 0L6 7" /><path d="M2 8v11c0 1.1.9 2 2 2h14" /></svg>
          <h1 className="text-xl font-bold">DevMail <small className="text-muted-foreground font-normal max-[375px]:hidden">Fake SMTP Server</small></h1>
        </div>
        <div className="flex items-center">
          <ButtonInfo />
          <ButtonTheme
            theme={theme}
            onSet={onSet}
          />
        </div>
      </div>
    </header>
  );
}