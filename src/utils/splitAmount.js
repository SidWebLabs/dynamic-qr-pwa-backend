const { CONSTANTS } = require("../lib/constant");

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

const isWholeRupee = (n) => Math.abs(n - Math.round(n)) < 1e-9;

/**
 * Random integer in inclusive range [min, max]
 */
const randInt = (min, max) => {
    const lo = Math.ceil(min);
    const hi = Math.floor(max);
    if (lo > hi) throw new Error("Invalid split range");
    return lo + Math.floor(Math.random() * (hi - lo + 1));
};

/**
 * Split using whole units (rupees or paise) so the sum always equals total exactly.
 * Prefer whole rupees when the entered amount has no decimals.
 */
exports.splitAmountRandomly = (
    total,
    parts = CONSTANTS.SPLIT_PARTS,
    maxPerPart = CONSTANTS.SPLIT_MAX_PER_PART
) => {
    const amount = round2(Number(total));

    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Invalid amount for split");
    }

    if (amount > parts * maxPerPart) {
        throw new Error(
            `Amount ₹${amount} cannot be split into ${parts} parts of max ₹${maxPerPart}`
        );
    }

    // Use whole rupees when possible (avoids .05 / .72 floating display)
    // Otherwise work in paise (1/100) as integers
    const useRupees = isWholeRupee(amount);
    const scale = useRupees ? 1 : 100;
    const totalUnits = useRupees ? Math.round(amount) : Math.round(amount * 100);
    const maxUnits = useRupees ? maxPerPart : maxPerPart * 100;
    const minUnit = 1; // at least ₹1 or ₹0.01

    if (totalUnits < parts * minUnit) {
        throw new Error("Amount too small to split into required parts");
    }

    const unitParts = [];
    let remaining = totalUnits;

    for (let i = 0; i < parts - 1; i++) {
        const slotsLeft = parts - i;
        const minAllowed = Math.max(
            minUnit,
            remaining - (slotsLeft - 1) * maxUnits
        );
        const maxAllowed = Math.min(
            maxUnits,
            remaining - (slotsLeft - 1) * minUnit
        );

        if (minAllowed > maxAllowed) {
            throw new Error("Unable to split amount under max-per-part constraint");
        }

        const part = randInt(minAllowed, maxAllowed);
        unitParts.push(part);
        remaining -= part;
    }

    if (remaining < minUnit || remaining > maxUnits) {
        throw new Error("Split remainder out of allowed range");
    }

    unitParts.push(remaining);

    const amounts = unitParts.map((u) =>
        useRupees ? u : round2(u / scale)
    );

    // Final safety: exact sum check
    const sum = round2(amounts.reduce((s, a) => s + a, 0));
    if (sum !== amount) {
        throw new Error(
            `Split sum mismatch: parts=${amounts.join("+")} total=${amount}`
        );
    }

    return amounts;
};

exports.shouldSplitAmount = (amount) => {
    const val = Number(amount);
    return (
        Number.isFinite(val) &&
        val > CONSTANTS.SPLIT_MIN_EXCLUSIVE &&
        val < CONSTANTS.SPLIT_MAX_EXCLUSIVE
    );
};
