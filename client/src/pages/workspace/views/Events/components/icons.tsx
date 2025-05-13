import {
    FaEdge,
    FaInternetExplorer,
    FaMobileAlt,
    FaTabletAlt,
    FaWindows,
} from "react-icons/fa";
import {
    FaDesktop,
    FaGamepad,
    FaMicrochip,
    FaQuestion,
    FaTv,
    FaWatchmanMonitoring,
} from "react-icons/fa6";
import { HiCursorClick } from "react-icons/hi";
import { MdQrCode2 } from "react-icons/md";
import {
    SiAndroid,
    SiApple,
    SiBlackberry,
    SiBrave,
    SiDebian,
    SiFedora,
    SiFirefoxbrowser,
    SiFreebsd,
    SiGooglechrome,
    SiLinux,
    SiOpera,
    SiSafari,
    SiSamsung,
    SiTencentqq,
    SiUbuntu,
    SiVivaldi,
} from "react-icons/si";
import { TbWorld } from "react-icons/tb";

const defaultBrowserIcon = <TbWorld />;

type IconMapType = {
    events: {
        [key: string]: React.ReactNode;
    };
    browsers: {
        [key: string]: React.ReactNode;
    };
    os: {
        [key: string]: React.ReactNode;
    };
    devices: {
        [key: string]: React.ReactNode;
    };
    getEventIcon: (eventType: string) => React.ReactNode;
    getBrowserIcon: (browser: string) => React.ReactNode;
    getOSIcon: (os: string) => React.ReactNode;
    getDeviceIcon: (device: string) => React.ReactNode;
};

export const iconsMap: IconMapType = {
    events: {
        click: <HiCursorClick />,
        qr: <MdQrCode2 />,
        unknown: defaultBrowserIcon,
    },
    browsers: {
        chrome: <SiGooglechrome />,
        firefox: <SiFirefoxbrowser />,
        safari: <SiSafari />,
        edge: <FaEdge />,
        opera: <SiOpera />,
        "internet explorer": <FaInternetExplorer />,
        brave: <SiBrave />,
        vivaldi: <SiVivaldi />,
        "samsung internet": <SiSamsung />,
        "uc browser": defaultBrowserIcon,
        chromium: <SiGooglechrome />,
        "qq browser": <SiTencentqq />,
        unknown: defaultBrowserIcon,
    },
    os: {
        windows: <FaWindows />,
        macos: <SiApple />,
        linux: <SiLinux />,
        android: <SiAndroid />,
        ios: <SiApple />,
        "chrome os": <SiGooglechrome />,
        ubuntu: <SiUbuntu />,
        debian: <SiDebian />,
        fedora: <SiFedora />,
        freebsd: <SiFreebsd />,
        "windows phone": <FaWindows />,
        blackberry: <SiBlackberry />,
        unknown: <FaQuestion />,
    },
    devices: {
        desktop: <FaDesktop />,
        mobile: <FaMobileAlt />,
        tablet: <FaTabletAlt />,
        smarttv: <FaTv />,
        console: <FaGamepad />,
        wearable: <FaWatchmanMonitoring />,
        embedded: <FaMicrochip />,
        unknown: <FaQuestion />,
    },
    getEventIcon: (trigger: string) =>
        iconsMap.events[trigger?.toLowerCase()] || defaultBrowserIcon,
    getBrowserIcon: (browser: string) =>
        iconsMap.browsers[browser?.toLowerCase() || "unknown"] ||
        defaultBrowserIcon,
    getOSIcon: (os: string) => iconsMap.os[os?.toLowerCase()] || <FaQuestion />,
    getDeviceIcon: (device: string) =>
        iconsMap.devices[device?.toLowerCase()] || <FaQuestion />,
};
