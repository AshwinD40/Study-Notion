const dns = require("dns");
const mongoose = require("mongoose");
require("dotenv").config();

function isSrvDnsError(error) {
  const message = error?.message || "";
  const code = error?.code || "";
  return (
    /querySrv/i.test(message) ||
    /_mongodb\._tcp/i.test(message) ||
    ["ECONNREFUSED", "ENOTFOUND", "ETIMEOUT", "ESERVFAIL"].includes(code)
  );
}

function getMongoOptions() {
  const family = Number(process.env.MONGO_DNS_FAMILY || 4);
  return {
    family: Number.isNaN(family) ? 4 : family,
    serverSelectionTimeoutMS: Number(
      process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 15000
    ),
    socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS || 45000),
  };
}

function maybeApplyPreferredDnsServers() {
  const shouldPreferFallbackDns =
    process.env.MONGO_PREFER_FALLBACK_DNS === "true";
  if (!shouldPreferFallbackDns) return;

  const preferredServers = (process.env.MONGO_DNS_SERVERS || "8.8.8.8,1.1.1.1")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (preferredServers.length > 0) {
    dns.setServers(preferredServers);
    console.warn(
      `[database] Using preferred DNS servers before initial connect: ${preferredServers.join(
        ", "
      )}`
    );
  }
}

async function connectWithDnsFallback(mongoUrl, options) {
  maybeApplyPreferredDnsServers();

  try {
    await mongoose.connect(mongoUrl, options);
    return;
  } catch (error) {
    if (!isSrvDnsError(error)) {
      throw error;
    }

    const fallbackServers = (process.env.MONGO_DNS_SERVERS || "8.8.8.8,1.1.1.1")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (fallbackServers.length > 0) {
      dns.setServers(fallbackServers);
      console.warn(
        `[database] Retrying MongoDB connection with DNS servers: ${fallbackServers.join(
          ", "
        )}`
      );
    }

    await mongoose.connect(mongoUrl, options);
  }
}

exports.connect = async () => {
  try {
    const mongoUrl = (process.env.MONGODB_URL || "").trim();

    if (!mongoUrl) {
      throw new Error("MONGODB_URL is missing in environment configuration");
    }

    await connectWithDnsFallback(mongoUrl, getMongoOptions());
    console.log("DB connected Successfully");
  } catch (err) {
    console.log("DB connection failed");
    console.log(err);
    process.exit(1);
  }
};
