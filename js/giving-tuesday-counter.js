  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLUQIMh0MvXL3QQeoWvyy13Cx9KJb8i67SLYWL2bBhw1aHU8FiQbPCqtzqRitC35TpubWR33D_BKRW/pub?gid=0&single=true&output=tsv';

    async function updateThermometer() {
        try {
            const response = await fetch(SHEET_URL);
            const csvText = await response.text();

            // Parse CSV into key-value pairs
            const data = {};
            const rows = csvText.trim().split('\n');

            rows.forEach(row => {
                const [key, value] = row.split('\t');
                // Remove quotes and dollar signs, parse as number
                const cleanValue = value.replace(/[^0-9.]/g, '');
                data[key] = parseFloat(cleanValue);
            });

            // Get values from CSV
            const raisedAmount = data['raised-without-match'] || 0;
            const matchMax = data['match-max'] || 0;
            const goal = data['therm-high'] || 0;
            const goal_mid = (goal / 2);


            // Calculate percentage
            const percentage = Math.min((raisedAmount / goal) * 100, 100);

            const matchedTotal = raisedAmount <= matchMax ? raisedAmount : matchMax;

            const remaining = goal - (raisedAmount + matchedTotal);

            // Update the thermometer fill
            const fill = document.querySelector('.kd-thermo__fill');
            if (fill) {
                fill.style.setProperty('--kd-fill-target', percentage + '%');

            }


            document.querySelector('span.kd-thermo-total').textContent = '$' + goal.toLocaleString();
            document.querySelector('span.kd-thermo_goal').textContent = '$' + goal.toLocaleString();
            document.querySelector('span.kd-thermo_goal_2').textContent = '$' + goal.toLocaleString();
            document.querySelector('span.kd-thermo_mid').textContent = '$' + goal_mid.toLocaleString();
            document.querySelector('span.kd-thermo_raised_total').textContent = '$' + raisedAmount.toLocaleString();
            document.querySelector('span.kd-thermo_remaining').textContent = '$' + remaining.toLocaleString();
            document.querySelector('span.kd-thermo_match_max').textContent = '$' + matchMax.toLocaleString();
            document.querySelector('span.kd-thermo_matched_total').textContent = '$' + matchedTotal.toLocaleString();

            console.log(`Raised: $${raisedAmount.toLocaleString()} of $${goal.toLocaleString()} (${percentage.toFixed(1)}%)`);

        } catch (error) {
            console.error('Error fetching fundraising data:', error);
        }
    }

    // Update on page load
    updateThermometer();

    // Optional: Update every 5 minutes
    setInterval(updateThermometer, 5 * 60 * 1000);
