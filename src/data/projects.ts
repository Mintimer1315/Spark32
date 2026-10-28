import type { Project } from "../types";

export const projects: Project[] = [
  {
    id: "blink",
    title: "Дыхание светодиода",
    level: "Старт",
    minutes: 20,
    summary: "Первый ритуал: GPIO, задержка и плавный ШИМ, чтобы плата «ожила».",
    parts: ["ESP32 DevKit", "Светодиод", "Резистор 220 Ω"],
    viz: "pwm",
    steps: [
      "Светодиод анодом через резистор на GPIO 18, катод на GND.",
      "Прошейте мигание digitalWrite, убедитесь, что порт и скорость 115200 верны.",
      "Замените мигание на LEDC: частота 5 кГц, 8 бит, цикл 0…255 и обратно.",
      "Вынесите яркость в переменную и добавьте Serial-отладку.",
    ],
    code: `const int LED = 18;
void setup() {
  ledcSetup(0, 5000, 8);
  ledcAttachPin(LED, 0);
}
void loop() {
  for (int i = 0; i < 256; i++) { ledcWrite(0, i); delay(6); }
  for (int i = 255; i >= 0; i--) { ledcWrite(0, i); delay(6); }
}`,
  },
  {
    id: "button-led",
    title: "Кнопка без дребезга",
    level: "Старт",
    minutes: 25,
    summary: "INPUT_PULLUP, антидребезг по времени, переключение состояния.",
    parts: ["ESP32", "Тактовая кнопка"],
    viz: "gpio",
    steps: [
      "Кнопка между GPIO 4 и GND, pinMode INPUT_PULLUP.",
      "Фиксируйте момент перехода HIGH→LOW, а не уровень.",
      "Игнорируйте повторные фронты 40–50 мс.",
      "Переключайте флаг и светодиод только на чистом фронте.",
    ],
    code: `const int BTN = 4, LED = 2;
bool on = false;
uint32_t last = 0;
void setup() {
  pinMode(BTN, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
}
void loop() {
  if (digitalRead(BTN) == LOW && millis() - last > 50) {
    on = !on;
    digitalWrite(LED, on);
    last = millis();
    while (digitalRead(BTN) == LOW) delay(1);
  }
}`,
  },
  {
    id: "web-relay",
    title: "Веб-реле в домашней сети",
    level: "Средний",
    minutes: 45,
    summary: "STA + WebServer: страница с кнопкой включает GPIO, будто умная розетка.",
    parts: ["ESP32", "Модуль реле 3.3/5 В", "Источник 5 В"],
    viz: "wifi",
    steps: [
      "Реле IN на GPIO 26, общая земля с модулем. Проверьте уровень IN.",
      "Подключитесь к Wi‑Fi, печатайте IP в Serial.",
      "WebServer: GET / отдаёт HTML, GET /on и /off пишут GPIO.",
      "Откройте IP с телефона в той же сети.",
    ],
    code: `#include <WiFi.h>
#include <WebServer.h>
WebServer server(80);
const int RELAY = 26;
void setup() {
  pinMode(RELAY, OUTPUT);
  WiFi.begin("ssid", "pass");
  while (WiFi.status() != WL_CONNECTED) delay(200);
  server.on("/", []() {
    server.send(200, "text/html",
      "<a href='/on'>ON</a> <a href='/off'>OFF</a>");
  });
  server.on("/on", []() { digitalWrite(RELAY, HIGH); server.send(200, "text/plain", "on"); });
  server.on("/off", []() { digitalWrite(RELAY, LOW); server.send(200, "text/plain", "off"); });
  server.begin();
}
void loop() { server.handleClient(); }`,
  },
  {
    id: "oled-temp",
    title: "OLED и температура",
    level: "Средний",
    minutes: 40,
    summary: "I2C SSD1306 + DHT22 или BMP280: локальная метеостанция.",
    parts: ["ESP32", "SSD1306 128x64", "DHT22 или BMP280"],
    viz: "bus",
    steps: [
      "SDA 21, SCL 22, питание 3.3 В. Адрес дисплея 0x3C.",
      "Сканер I2C подтверждает 0x3C и датчик.",
      "Библиотека Adafruit SSD1306: шрифт, clear, display.",
      "Раз в 2 с читайте датчик и рисуйте крупные цифры.",
    ],
    code: `// Wire.begin(21, 22);
// display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
// display.clearDisplay();
// display.setTextSize(2);
// display.setCursor(0, 20);
// display.print(t);
// display.print(" C");
// display.display();`,
  },
  {
    id: "mqtt",
    title: "MQTT телеметрия",
    level: "Продвинутый",
    minutes: 50,
    summary: "Брокер Mosquitto, топики spark32/room/temp, кнопка как command.",
    parts: ["ESP32", "Датчик", "Брокер в LAN или облако"],
    viz: "wifi",
    steps: [
      "Поднимите Mosquitto или используйте test.mosquitto.org осторожно.",
      "PubSubClient: connect, publish JSON, subscribe cmd.",
      "В callback парсите payload и меняйте GPIO.",
      "LWT: топик status = offline при обрыве.",
    ],
    code: `// client.setServer(broker, 1883);
// client.publish("spark32/temp", "24.1");
// client.subscribe("spark32/cmd");`,
  },
  {
    id: "sleep-logger",
    title: "Логгер на батарее",
    level: "Продвинутый",
    minutes: 55,
    summary: "Deep sleep, измерение раз в 10 минут, отправка и снова сон.",
    parts: ["ESP32", "LiPo + зарядка", "Датчик"],
    viz: "sleep",
    steps: [
      "Измерьте ток USB‑тестером: в активном режиме десятки мА.",
      "esp_sleep_enable_timer_wakeup, отключите Wi‑Fi перед сном.",
      "RTC_DATA_ATTR счётчик пробуждений.",
      "Просыпание → Wi‑Fi → одно измерение → sleep.",
    ],
    code: `RTC_DATA_ATTR int boots = 0;
void setup() {
  boots++;
  Serial.begin(115200);
  Serial.printf("boot %d\\n", boots);
  esp_sleep_enable_timer_wakeup(10ULL * 60 * 1000000);
  esp_deep_sleep_start();
}
void loop() {}`,
  },
];
