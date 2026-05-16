import crypto from "node:crypto";
import { env } from "@/lib/env";

function publicUrl(key: string) {
  return `${env.r2PublicUrl.replace(/\/$/, "")}/${key}`;
}
function hmac(key: Buffer | string, data: string) { return crypto.createHmac("sha256", key).update(data).digest(); }
function hash(data: Buffer | string) { return crypto.createHash("sha256").update(data).digest("hex"); }
function signingKey(secret: string, date: string) {
  const kDate = hmac(`AWS4${secret}`, date);
  const kRegion = hmac(kDate, "auto");
  const kService = hmac(kRegion, "s3");
  return hmac(kService, "aws4_request");
}

export async function uploadVideoToR2(key: string, body: Buffer, contentType = "video/mp4") {
  if (!env.r2PublicUrl) throw new Error("R2_PUBLIC_URL is required");
  if (!env.r2AccountId || !env.r2AccessKeyId || !env.r2SecretAccessKey) return publicUrl(key);
  const host = `${env.r2AccountId}.r2.cloudflarestorage.com`;
  const path = `/${env.r2Bucket}/${key.split("/").map(encodeURIComponent).join("/")}`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = hash(body);
  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = ["PUT", path, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, hash(canonicalRequest)].join("\n");
  const signature = crypto.createHmac("sha256", signingKey(env.r2SecretAccessKey, dateStamp)).update(stringToSign).digest("hex");
  const authorization = `AWS4-HMAC-SHA256 Credential=${env.r2AccessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  const response = await fetch(`https://${host}${path}`, { method: "PUT", headers: { "Content-Type": contentType, "x-amz-date": amzDate, "x-amz-content-sha256": payloadHash, Authorization: authorization, "Cache-Control": "public, max-age=31536000, immutable" }, body });
  if (!response.ok) throw new Error(`R2 upload failed: ${response.status} ${await response.text()}`);
  return publicUrl(key);
}

export async function createUploadUrl(key: string, _contentType: string) {
  return publicUrl(key);
}
