import { ITextProps, Stack, Text } from "@fluentui/react";
import React from "react";

import styles from "./Header.module.css";

interface IHeaderProps extends ITextProps {
    onClick: () => void;
    title: string;
    imgSrc: string;
    disabled: boolean;
}

export const Header: React.FC<IHeaderProps> = (p: IHeaderProps) => {
    const handleClick = () => {
        if (!p.disabled) {
            p.onClick();
        }
    }

    return (
        <header className={styles.header} role={"banner"}>
            <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
                <Stack horizontal verticalAlign="center" style={{ cursor: p.disabled ? 'default' : 'pointer' }}>
                        <img
                            src={p.imgSrc}
                            className={styles.headerIcon}
                            aria-hidden="true" 
                            onClick={handleClick}/>
                        <h1 className={styles.headerTitle} onClick={handleClick}>{p.title}</h1>
                </Stack>
            </Stack>
        </header>
    );
};