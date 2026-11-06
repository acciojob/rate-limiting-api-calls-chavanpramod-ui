//your JS code here. If required.
document.addEventListener("DOMContentLoaded", () => {
    const fetchBtn = document.getElementById("fetch-data-btn");
    const clickCounterEl = document.getElementById("click-counter");
    const resultsDiv = document.getElementById("results");

    let clickCount = 0;
    let clickResetTimer = null;

    const rateLimiter = {
        queue: [],
        timestamps1s: [],
        timestamps10s: [],
        processing: false,

        enqueue(fn) {
            return new Promise((resolve, reject) => {
                this.queue.push({ fn, resolve, reject });
                this.processQueue();
            });
        },

        async processQueue() {
            if (this.processing || this.queue.length === 0) return;

            const now = Date.now();

            this.timestamps1s = this.timestamps1s.filter(t => now - t < 1000);
            this.timestamps10s = this.timestamps10s.filter(t => now - t < 10000);

            if (this.timestamps1s.length >= 5 || this.timestamps10s.length >= 5) {
                let delay1s = 0;
                let delay10s = 0;

                if (this.timestamps1s.length >= 5) {
                    delay1s = 1000 - (now - this.timestamps1s[0]);
                }
                if (this.timestamps10s.length >= 5) {
                    delay10s = 10000 - (now - this.timestamps10s[0]);
                }

                const waitTime = Math.max(delay1s, delay10s, 50);

                setTimeout(() => this.processQueue(), waitTime);
                return;
            }

            this.processing = true;

            const { fn, resolve, reject } = this.queue.shift();
            const executionTime = Date.now();

            this.timestamps1s.push(executionTime);
            this.timestamps10s.push(executionTime);

            try {
                const result = await fn();
                resolve(result);
            } catch (error) {
                reject(error);
            } finally {
                this.processing = false;
                this.processQueue();
            }
        }
    };

    function handleClick() {
        clickCount++;
        clickCounterEl.textContent = `Clicks (10s): ${clickCount}`;

        if (!clickResetTimer) {
            clickResetTimer = setTimeout(() => {
                clickCount = 0;
                clickCounterEl.textContent = `Clicks (10s): 0`;
                clickResetTimer = null;
            }, 10000);
        }

        rateLimiter.enqueue(() => fetch("https://jsonplaceholder.typicode.com/todos/1").then(res => res.json()))
            .then(data => {
                renderResult(data);
            })
            .catch(err => {
                console.error("API Fetch Error:", err);
            });
    }

    function renderResult(data) {
        const card = document.createElement("div");
        card.className = "card";
        
        const isCompleted = data.completed;
        const statusClass = isCompleted ? "completed" : "pending";
        
        card.innerHTML = `
            <p><strong>ID:</strong> ${data.id}</p>
            <p><strong>Title:</strong> ${data.title}</p>
            <p><strong>Completed:</strong> <span class="status ${statusClass}">${isCompleted}</span></p>
        `;

        resultsDiv.appendChild(card);
    }

    fetchBtn.addEventListener("click", handleClick);
});