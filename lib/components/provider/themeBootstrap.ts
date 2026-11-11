type ThemeSetting = 'light' | 'dark' | 'system';

/**
 * A source-owned pre-hydration script. Keep it literal: Function.toString()
 * can capture private helpers injected by an edge application's bundler.
 * This uses the same storage key, classes and defaults as NextThemesProvider.
 */
export function getThemeBootstrapScript(
  defaultMode: ThemeSetting,
  forcedMode?: 'light' | 'dark',
): string {
  const args = JSON.stringify([defaultMode, forcedMode ?? null])
    .slice(1, -1)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  return `(function(defaultMode,forcedMode){
    var setting=forcedMode;
    if(!setting){
      try{setting=window.localStorage.getItem("theme");}catch(error){}
      if(setting!=="light"&&setting!=="dark"&&setting!=="system") setting=defaultMode;
    }
    var dark=setting==="dark";
    if(setting==="system"){
      try{dark=window.matchMedia("(prefers-color-scheme: dark)").matches;}catch(error){}
    }
    var mode=dark?"dark":"light";
    var root=document.documentElement;
    root.classList.remove("light","dark");
    root.classList.add(mode);
    root.style.colorScheme=mode;
  })(${args});`;
}
