const isLikelyHexObjectId = (value) => /^[a-fA-F0-9]{24}$/.test(value);

const normalizeIdCandidate = (candidate) => {
  if (typeof candidate === "string") {
    const normalized = candidate.trim();
    return normalized || "";
  }

  if (typeof candidate === "number") {
    return String(candidate);
  }

  if (candidate && typeof candidate === "object") {
    if (typeof candidate.$oid === "string") {
      return candidate.$oid;
    }

    if (typeof candidate.toString === "function") {
      const asString = candidate.toString();
      if (typeof asString === "string" && isLikelyHexObjectId(asString)) {
        return asString;
      }
    }
  }

  return "";
};

const getEntityId = (value) => {
  if (!value) {
    return "";
  }

  const directId = normalizeIdCandidate(value);
  if (directId) {
    return directId;
  }

  if (typeof value === "object") {
    const objectId = normalizeIdCandidate(value._id);
    if (objectId) {
      return objectId;
    }

    const plainId = normalizeIdCandidate(value.id);
    if (plainId) {
      return plainId;
    }
  }

  return "";
};

const dedupeById = (items = []) => {
  const map = new Map();

  items.forEach((item) => {
    const id = getEntityId(item);

    if (!id) {
      return;
    }

    map.set(id, item);
  });

  return Array.from(map.values());
};

export { getEntityId, dedupeById };
