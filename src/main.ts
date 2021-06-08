import App from './App.svelte';
new App({
	target: document.body,
});

if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('/service-worker.js');
	});
}
