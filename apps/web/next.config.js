const { withAxiom } = require('next-axiom');

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/ui"],
}

module.exports = withAxiom(nextConfig);
