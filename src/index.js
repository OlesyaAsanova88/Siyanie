import 'normalize.css'
import './styles/main.scss';

 var swiper = new Swiper(".mySwiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      pagination: {
        el: ".swiper-pagination",
      },
    });

     const canvas = document.getElementById('stars-canvas');
        const ctx = canvas.getContext('2d');

        let width, height;
        let stars = [];
        const STAR_COUNT = 150;

        // Настройка размеров холста
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        // Класс звезды
        class Star {
            constructor() {
                this.reset(true);
            }

            reset(init = false) {
                this.x = Math.random() * width;
                this.y = init ? Math.random() * height : -Math.random() * 50;
                this.size = Math.random() * 2 + 0.5;
                this.speed = Math.random() * 0.8 + 0.2;
                this.opacity = Math.random() * 0.8 + 0.2;
                this.twinkleSpeed = Math.random() * 0.03 + 0.01;
                this.twinklePhase = Math.random() * Math.PI * 2;
                this.drift = (Math.random() - 0.5) * 0.3; // лёгкое покачивание
            }

            update() {
                // Падение вниз
                this.y += this.speed;
                // Лёгкое смещение в стороны
                this.x += this.drift;

                // Мерцание (синусоида)
                this.twinklePhase += this.twinkleSpeed;
                const twinkle = Math.sin(this.twinklePhase) * 0.4 + 0.6;
                this.currentOpacity = this.opacity * twinkle;

                // Если звезда упала ниже экрана — сброс наверх
                if (this.y > height + 10) {
                    this.reset(false);
                    this.y = -Math.random() * 20;
                }

                // Если улетела вбок — мягкое возвращение
                if (this.x > width + 20) this.x = -20;
                if (this.x < -20) this.x = width + 20;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.currentOpacity})`;
                ctx.fill();

                // Лёгкое сияние (для крупных звёзд)
                if (this.size > 1.8) {
                    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
                    ctx.shadowBlur = 12;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
        }

        // Создание звёзд
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push(new Star());
        }

        // Анимация
        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Рисуем звёзды
            for (const star of stars) {
                star.update();
                star.draw();
            }

            requestAnimationFrame(animate);
        }

        animate();

    