import Image from "next/legacy/image";
import { MainNav } from "@/components/ui/main-nav";
import React from "react";
import { LanguageCode } from "@/lib/definitions";

interface IHeaderProps {
  isFixed: boolean;
  enableChangeLanguage?: boolean;
  language?: LanguageCode;
  onChangeLanguage?: (language: LanguageCode) => void;
}

const Header = React.forwardRef<HTMLDivElement, IHeaderProps>(
  ({ isFixed, enableChangeLanguage, onChangeLanguage }) => {
    const noChangeLanguage = () => {};

    return (
      <span
        className={`flex flex-col items-start justify-between space-y-2 p-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16 bg-white ${
          isFixed ? "fixed top-0 w-full z-50" : ""
        }`}
      >
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] items-center justify-center mr-2"
          src="/beexpert-logo.svg"
          alt="BEEXPERT Logo"
          width={40}
          height={42.5}
          priority
        />
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert items-center justify-center"
          src="/beexpert-name.svg"
          alt="BEEXPERT"
          width={170}
          height={19}
          priority
        />
        <div className="ml-auto flex w-full space-x-2 sm:justify-end">
          <MainNav
            className="mx-6"
            enableChangeLanguage={enableChangeLanguage}
            onChangeLanguage={onChangeLanguage ?? noChangeLanguage}
          />
        </div>
      </span>
    );
  },
);

Header.displayName = "Header";
export { Header };
