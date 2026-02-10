// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Toggle FAQ
function toggleFaq(el) {
    const parent = el.closest('.faq-item');
    const answer = parent.querySelector('.faq-answer');
    const isActive = el.classList.toggle('active');
    answer.classList.toggle('active', isActive);
}

// Core calculation logic
function calculateSolar() {
    const billInput = document.getElementById('billAmount');
    const tariffInput = document.getElementById('tariff');
    const isCommercial = document.getElementById('isCommercial');

    const billAmount = parseFloat(billInput.value) || 0;
    const tariff = parseFloat(tariffInput ? tariffInput.value : 8) || 8;
    const regionGen = 4.5; // Pune default kWh per kW per day
    const days = 30;

    // Determine if commercial by heuristics (user requested simplified approach)
    const commercial = billAmount > 10000 || (isCommercial && isCommercial.checked);

    // Units consumed per month estimated from bill / tariff
    const monthlyUnits = tariff > 0 ? billAmount / tariff : 0;
    const dailyUnits = monthlyUnits / days;

    // Required system size (kW)
    const requiredKw = regionGen > 0 ? dailyUnits / regionGen : 0;
    // Round to nearest 0.5 kW for practical system sizes
    const roundedKw = Math.ceil(requiredKw * 2) / 2 || 0.5;

    // Pricing assumptions
    const costPerKwResidential = 60000; // typical installed cost per kW (residential)
    const costPerKwCommercial = 75000; // higher for commercial or larger systems
    const costPerKw = commercial ? costPerKwCommercial : costPerKwResidential;

    const totalCostBefore = Math.round(roundedKw * costPerKw);

    // Subsidy logic: user wanted 30,000 per kW up to 2kW; 3rd kW 18,000; max 78,000
    function calculateSubsidy(kw) {
        let subsidy = 0;
        const wholeKw = Math.floor(kw);
        const fraction = Math.round((kw - wholeKw) * 100) / 100;

        // apply per full kW first
        for (let i = 1; i <= wholeKw; i++) {
            if (i <= 2) subsidy += 30000;
            else if (i === 3) subsidy += 18000;
            else subsidy += 0;
        }

        // fractional kW subsidy prorated conservatively
        if (fraction > 0) {
            const nextKwIndex = wholeKw + 1;
            if (nextKwIndex <= 2) subsidy += 30000 * fraction;
            else if (nextKwIndex === 3) subsidy += 18000 * fraction;
        }

        if (subsidy > 78000) subsidy = 78000;
        return Math.round(subsidy);
    }

    const subsidyAmt = calculateSubsidy(roundedKw);
    const netCost = Math.max(0, totalCostBefore - subsidyAmt);

    const monthlySavings = Math.round(billAmount); // assume full bill offset for simplified calculation
    const annualSavings = Math.round(monthlySavings * 12);
    let paybackYears = null;
    if (annualSavings > 0) paybackYears = (netCost / annualSavings).toFixed(2);

    // Update UI
    const solarSizeEl = document.getElementById('solarSize');
    if (solarSizeEl) solarSizeEl.textContent = roundedKw + ' kW';
    const systemCostEl = document.getElementById('systemCost');
    if (systemCostEl) systemCostEl.textContent = '₹ ' + totalCostBefore.toLocaleString();
    const subsidyEl = document.getElementById('subsidyAmount');
    if (subsidyEl) subsidyEl.textContent = '₹ ' + subsidyAmt.toLocaleString();
    const netCostEl = document.getElementById('netCost');
    if (netCostEl) netCostEl.textContent = '₹ ' + netCost.toLocaleString();
    const monthlyEl = document.getElementById('monthlySavings');
    if (monthlyEl) monthlyEl.textContent = '₹ ' + monthlySavings.toLocaleString();
    const annualEl = document.getElementById('annualSavings');
    if (annualEl) annualEl.textContent = '₹ ' + annualSavings.toLocaleString();
    const paybackEl = document.getElementById('payback');
    if (paybackEl) paybackEl.textContent = paybackYears ? paybackYears + ' yrs' : '—';

    const resultsBox = document.getElementById('results');
    if (resultsBox) resultsBox.classList.add('show');
}

// Form submit handler
function handleFormSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    calculateSolar();
    const benefitsAnchor = document.getElementById('benefits');
    if (benefitsAnchor) benefitsAnchor.scrollIntoView({ behavior: 'smooth' });
}

// Attach the form submit if present
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('calculatorForm');
    if (form) form.addEventListener('submit', handleFormSubmit);
});
