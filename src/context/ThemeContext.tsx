import React, { createContext, useState, useEffect } from 'react';
import { storeData, getData } from '../config/asyncStorage';




type availableThemes = "light" | "dark";

type ThemeContextType = {
    mode: availableThemes;
    updateTheme: Function;
};
export const ThemeContext = createContext<ThemeContextType>({
    mode: 'dark',
    updateTheme: (theme: availableThemes) => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<{mode: availableThemes}>({mode: 'dark'});

    const updateTheme = (newTheme: availableThemes) => {
        if (!newTheme) {
            const mode = theme.mode === 'dark' ? 'light' : 'dark';
            setTheme({ mode });
        } else {
            setTheme({ mode: newTheme });
            storeData('theme', newTheme);
        }
    };
    const getTheme = async () => {
        try{
            const themeData = await getData('theme');
            if(themeData && themeData == "light" || themeData == "dark"){
                updateTheme(themeData);
            }
        }
        catch(error){
        } finally {

        }
    };
    useEffect(() => {
        getTheme();
    }, []);

    return (
        <ThemeContext.Provider value={{ mode: theme.mode, updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
