<template>
    <div
        class="fixed top-0 right-0 bottom-0 left-0 z-50 w-full h-screen flex items-center justify-center bg-gradient-radial from-slate-900 to-transparent"
    >
        <div class="loader2">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
</template>

<style scoped>
.loader2 {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
}
span {
    position: absolute;
    width: 6px;
    height: 6px;
    background: #528D36;
    border-radius: 50%;
    animation: loading2 1.2s linear infinite;
}
span:nth-child(1) {
    animation-delay: 0s;
    top: 37px;
    left: 66px;
}
span:nth-child(2) {
    animation-delay: -0.1s;
    top: 22px;
    left: 62px;
}
span:nth-child(3) {
    animation-delay: -0.2s;
    top: 11px;
    left: 52px;
}
span:nth-child(4) {
    animation-delay: -0.3s;
    top: 7px;
    left: 37px;
}
span:nth-child(5) {
    animation-delay: -0.4s;
    top: 11px;
    left: 22px;
}
span:nth-child(6) {
    animation-delay: -0.5s;
    top: 22px;
    left: 11px;
}
span:nth-child(7) {
    animation-delay: -0.6s;
    top: 37px;
    left: 7px;
}
span:nth-child(8) {
    animation-delay: -0.7s;
    top: 52px;
    left: 11px;
}
span:nth-child(9) {
    animation-delay: -0.8s;
    top: 62px;
    left: 22px;
}
span:nth-child(10) {
    animation-delay: -0.9s;
    top: 66px;
    left: 37px;
}
span:nth-child(11) {
    animation-delay: -1s;
    top: 62px;
    left: 52px;
}
span:nth-child(12) {
    animation-delay: -1.1s;
    top: 52px;
    left: 62px;
}
@keyframes loading2 {
    0%,
    20%,
    80%,
    100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.5);
    }
}
</style>
