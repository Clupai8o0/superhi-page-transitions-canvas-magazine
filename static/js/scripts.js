const body = document.querySelector("body");

// to run the image animation in every page
const runScripts = () => {
	const headers = document.querySelectorAll("h2, h3");
	const imageHolders = document.querySelectorAll("div.image");

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.intersectionRatio >= 0.1) {
					entry.target.classList.add("in-view");
				} else {
					entry.target.classList.remove("in-view");
				}
			});
		},
		{
			threshold: [0, 0.1, 1],
		}
	);

	headers.forEach((header) => {
		observer.observe(header);
	});
	imageHolders.forEach((holder) => {
		observer.observe(holder);
	});
};
runScripts();

//* Barba
barba.init({
	transitions: [
		{
			name: "switch",
			once({ _, next }) {
				return new Promise((resolve) => {
					const timeline = gsap.timeline({
						onComplete() {
							resolve();
						},
					});

					timeline
						.set(next.container, { opacity: 0 })
						.to(next.container, { opacity: 1, delay: 1 });
				});
			},
			leave({ current }) {
				return new Promise((resolve) => {
					const timeline = gsap.timeline({
						onComplete() {
							current.container.remove(); // to avoid flicking
							resolve();
						},
					});

					timeline
						.to("header", { y: "-100%" }, 0)
						.to("footer", { y: "100%" }, 0)
						.to(current.container, { opacity: 0 });
				});
			},
			enter({ _, next }) {
				return new Promise((resolve) => {
					window.scrollTo({
						top: 0,
						behavior: "smooth",
					});

					const timeline = gsap.timeline({
						onComplete() {
							runScripts();
							resolve();
						},
					});

					timeline
						.set(next.container, { opacity: 0 })
						.to("header", { y: "0%" }, 0)
						.to("footer", { y: "0%" }, 0)
						.to(next.container, { opacity: 1 });
				});
			},
		},
	],
	views: [
		{
			namespace: "product",
			beforeEnter() {
				body.classList.add("product");
			},
			afterLeave() {
				body.classList.remove("product");
			},
		},
	],
	debug: false,
});
