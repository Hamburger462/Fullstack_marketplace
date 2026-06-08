import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

const FEATURED_PRODUCTS = [
    { id: 1, name: "Studio Pro headphones", price: 129, rating: 4.8, bg: "#EEEDFE", icon: "🎧", slug: "/items/1" },
    { id: 2, name: "Ceramic planter set",   price: 44,  rating: 4.6, bg: "#E1F5EE", icon: "🪴", slug: "/items/2" },
    { id: 3, name: "Linen table lamp",      price: 89,  rating: 4.9, bg: "#FAEEDA", icon: "🪔", slug: "/items/3" },
    { id: 4, name: "Trail daypack 22L",     price: 74,  rating: 4.7, bg: "#FAECE7", icon: "🎒", slug: "/items/4" },
];

const HERO_ITEMS = [
    { name: "Studio Pro headphones", price: "$129.00", bg: "#EEEDFE", icon: "🎧" },
    { name: "Ceramic planter set",   price: "$44.00",  bg: "#E1F5EE", icon: "🪴" },
    { name: "Linen table lamp",      price: "$89.00",  bg: "#FAEEDA", icon: "🪔" },
    { name: "Trail daypack 22L",     price: "$74.00",  bg: "#FAECE7", icon: "🎒" },
];

const FEATURES = [
    {
        title: "Buyer protection",
        desc: "Every purchase is covered. If something goes wrong, we make it right — no questions asked.",
        icon: "🛡️",
    },
    {
        title: "Fast delivery",
        desc: "Next-day delivery on thousands of items. Track your order in real time from checkout to doorstep.",
        icon: "🚚",
    },
    {
        title: "Trusted sellers",
        desc: "All sellers are verified and rated by real buyers. Only the best make it onto our platform.",
        icon: "👥",
    },
];

export default function HomePage() {
    return (
        <div className={styles.page}>

            {/* ── Hero ── */}
            <section className={styles.hero}>
                <div>
                    <p className={styles.heroEyebrow}>New arrivals every week</p>
                    <h1 className={styles.heroTitle}>
                        Shop smarter,{" "}
                        <br />
                        live{" "}
                        <span className={styles.heroTitleAccent}>better</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Discover curated products from trusted sellers. Quality goods,
                        transparent pricing, fast delivery.
                    </p>
                    <div className={styles.heroActions}>
                        <Link to="/items" className={styles.btnPrimary}>
                            Browse catalogue →
                        </Link>
                        <Link to="/register" className={styles.btnOutline}>
                            Become a seller
                        </Link>
                    </div>
                </div>

                <div className={styles.heroVisual}>
                    {HERO_ITEMS.map((item) => (
                        <div key={item.name} className={styles.miniCard}>
                            <div
                                className={styles.miniCardImg}
                                style={{ background: item.bg }}
                            >
                                {item.icon}
                            </div>
                            <div className={styles.miniCardName}>{item.name}</div>
                            <div className={styles.miniCardPrice}>{item.price}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Stats ── */}
            <div className={styles.statsRow}>
                <div className={styles.stat}>
                    <span className={styles.statNum}>12,400+</span>
                    <span className={styles.statLabel}>Products listed</span>
                </div>
                <div className={styles.statSep} />
                <div className={styles.stat}>
                    <span className={styles.statNum}>3,200</span>
                    <span className={styles.statLabel}>Active sellers</span>
                </div>
                <div className={styles.statSep} />
                <div className={styles.stat}>
                    <span className={styles.statNum}>98%</span>
                    <span className={styles.statLabel}>Satisfaction rate</span>
                </div>
                <div className={styles.statSep} />
                <div className={styles.stat}>
                    <span className={styles.statNum}>Next-day</span>
                    <span className={styles.statLabel}>Delivery available</span>
                </div>
            </div>

            {/* ── Featured products ── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Featured products</h2>
                    <Link to="/items" className={styles.sectionLink}>
                        View all →
                    </Link>
                </div>

                <div className={styles.productGrid}>
                    {FEATURED_PRODUCTS.map((p) => (
                        <Link key={p.id} to={p.slug} className={styles.productCard}>
                            <div
                                className={styles.productImg}
                                style={{ background: p.bg }}
                            >
                                {p.icon}
                            </div>
                            <div className={styles.productInfo}>
                                <div className={styles.productName}>{p.name}</div>
                                <div className={styles.productMeta}>
                                    <span className={styles.productPrice}>${p.price}</span>
                                    <span className={styles.productRating}>★ {p.rating}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Features ── */}
            <div className={styles.features}>
                {FEATURES.map((f) => (
                    <div key={f.title} className={styles.featCard}>
                        <div className={styles.featIcon}>{f.icon}</div>
                        <div className={styles.featTitle}>{f.title}</div>
                        <p className={styles.featDesc}>{f.desc}</p>
                    </div>
                ))}
            </div>

            {/* ── CTA band ── */}
            <div className={styles.ctaBand}>
                <div>
                    <p className={styles.ctaTitle}>Start selling today</p>
                    <p className={styles.ctaDesc}>
                        List your first product in minutes. No upfront fees — we only earn when you do.
                    </p>
                </div>
                <Link to="/register" className={styles.btnWhite}>
                    Open a seller account
                </Link>
            </div>

        </div>
    );
}