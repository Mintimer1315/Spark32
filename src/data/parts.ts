import type { Part } from "../types";

export const parts: Part[] = [
  { id: "led", name: "Светодиод 3 мм / 5 мм", category: "Выход", pins: "A → резистор → GPIO, K → GND", note: "Красный ~1.8 В, синий ~3.0 В. Резистор 220–1 кОм. Не подключайте к 5 В без расчёта." },
  { id: "btn", name: "Тактовая кнопка", category: "Вход", pins: "GPIO ↔ GND, INPUT_PULLUP", note: "Дребезг 10–50 мс. Не вешайте на strapping, если кнопка залипает при старте." },
  { id: "dht22", name: "DHT22 / AM2302", category: "Датчик", pins: "VCC 3.3–5, DATA, GND", note: "Один провод данных, резистор 4.7 кОм к VCC. Медленный, раз в 2 с." },
  { id: "bmp280", name: "BMP280", category: "Датчик", pins: "I2C 0x76/0x77", note: "Давление и температура. Питание 3.3 В, не 5 В." },
  { id: "ssd1306", name: "OLED SSD1306", category: "Индикация", pins: "SDA SCL, адрес 0x3C", note: "128×64. Яркий и экономный. I2C удобнее SPI для старта." },
  { id: "relay", name: "Модуль реле", category: "Сила", pins: "IN, VCC, GND", note: "Опторазвязка, катушка с 5 В, IN часто LOW-level trigger. Общий GND обязателен." },
  { id: "hc-sr04", name: "HC-SR04", category: "Датчик", pins: "TRIG, ECHO", note: "ECHO 5 В — делитель или модуль 3.3 В. pulseIn или RMT." },
  { id: "ws2812", name: "WS2812 / NeoPixel", category: "Индикация", pins: "DIN с GPIO", note: "5 В питание ленты, DIN через 330 Ω, общий GND. Библиотека FastLED/NeoPixel, RMT." },
  { id: "sg90", name: "Серво SG90", category: "Механика", pins: "PWM 50 Гц", note: "Питание с отдельного 5 В, не с 3V3 DevKit. Сигнал 3.3 В обычно принимается." },
  { id: "mpu6050", name: "MPU-6050", category: "Датчик", pins: "I2C 0x68", note: "Гироскоп+акселерометр. Фильтр Маджвика или DMP позже." },
  { id: "sd", name: "MicroSD SPI", category: "Память", pins: "CS MOSI MISO SCK", note: "3.3 В карта и уровень. Не делите пины с Flash чипа." },
  { id: "pms", name: "PMS5003", category: "Датчик", pins: "UART 9600", note: "Пыль PM2.5. Serial2, вентилятор любит 5 В." },
];
