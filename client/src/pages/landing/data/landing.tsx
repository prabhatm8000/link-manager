import { AiOutlineFundView } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import { HiCursorClick } from "react-icons/hi";
import { IoIosLink, IoIosTimer } from "react-icons/io";
import { IoAnalytics, IoLocationOutline } from "react-icons/io5";
import { MdQrCode2, MdWorkspacesOutline } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";

const iconProps = {
    size: 24,
    className: "text-destructive",
};

const features = [
    {
        id: "workspaces",
        title: "Multiple Workspaces",
        description:
            "Organize your links across **multiple workspaces** and collaborate with teammates by inviting them to specific workspaces.",
        icon: <MdWorkspacesOutline {...iconProps} />,
    },
    {
        id: "short-links",
        title: "Short Links",
        description:
            "Create fast, reliable short links optimized for **performance** and modern browsers.",
        icon: <IoIosLink {...iconProps} />,
    },
    {
        id: "password-protection",
        title: "Password-Protected Links",
        description:
            "**Secure your links** with password protection to **control** who can access them.",
        icon: <TbLockPassword {...iconProps} />,
    },
    {
        id: "link-expiration",
        title: "Link Expiration",
        description:
            "Set an expiration date or trigger count to **automatically deactivate links**.",
        icon: <IoIosTimer {...iconProps} />,
    },
    {
        id: "custom-metadata",
        title: "Custom Link Preview",
        description:
            "Customize title, description, and preview image for each link to **optimize how it appears when shared**.",
        icon: <AiOutlineFundView {...iconProps} />,
    },
    {
        id: "branded-qr",
        title: "Branded QR Codes",
        description:
            "Generate high-quality QR codes for each link, fully brandable and ready to print or share.",
        icon: <MdQrCode2 {...iconProps} />,
    },
    {
        id: "trigger-events",
        title: "Trigger Event Capture",
        description:
            "Track every link click or QR scan as a trigger event for precise insights.",
        icon: <HiCursorClick {...iconProps} />,
    },
    {
        id: "csv-export",
        title: "CSV Export",
        description:
            "**Download raw event data as CSV** for offline analysis or reporting.",
        icon: <FiDownload {...iconProps} />,
    },
    {
        id: "geo-loc-tracking",
        title: "Geo-Location Tracking",
        description:
            "Track triggers **by location**, including city, region, and country.",
        icon: <IoLocationOutline {...iconProps} />,
    },
    {
        id: "analytics",
        title: "Advanced Analytics",
        description:
            "See detailed stats by device, browser, location, and more. **Visualize trends** with powerful date-range filtering.",
        icon: <IoAnalytics {...iconProps} />,
    },
];

const pricing = [
    {
        id: "free",
        title: "Free",
        description:
            "Perfect for individuals or early-stage projects exploring the platform.",
        per: "month",
        prices: {
            INR: "Rs. 0.00",
            USD: "$0.00",
        },
        features: [
            "2 Workspaces",
            "5 Short Links per workspace",
            "1000 Trigger Events",
        ],
    },
    {
        id: "premium",
        title: "Premium",
        description:
            "Best for growing teams and high-traffic use cases with advanced needs.",
        per: "month",
        prices: {
            INR: "Rs. 189.00",
            USD: "$5.49",
        },
        features: [
            "7 Workspaces",
            "12 Short Links per workspace",
            "30000 Trigger Events",
        ],
        popped: true,
    },
    {
        id: "basic",
        title: "Basic",
        description:
            "For small teams or creators who need more flexibility and traffic insights.",
        per: "month",
        prices: {
            INR: "Rs. 129.00",
            USD: "$3.99",
        },
        features: [
            "4 Workspaces",
            "7 Short Links per workspace",
            "10000 Trigger Events",
        ],
    },
];

const footerSectionData = [
    {
        title: "Quick Links",
        links: [
            { title: "Home", link: "#home" },
            { title: "Features", link: "#features" },
            { title: "Pricing", link: "#pricing" },
        ],
    },
    {
        title: "Contact",
        links: [
            { title: "E-Mail", link: "mailto:prabhatm8000@gmail.com" },
            { title: "GitHub", link: "https://github.com/prabhatm8000" },
            { title: "X", link: "https://x.com/Prabhat75279531?t=UChCR1Utkm4f43xDTi_vwg&s=09" },
        ],
    },
    {
        title: "Legal",
        links: [
            { title: "Terms of Service", link: "/legal/terms" },
            { title: "Privacy Policy", link: "/legal/privacy" },
        ],
    },
]

const landingData = {
    features,
    pricing,
    footerSectionData
};

export default landingData;
