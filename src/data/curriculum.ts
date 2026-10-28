import type { Course } from "../types";

export const courses: Course[] = [
  {
    id: "intro",
    title: "Знакомство с ESP32",
    subtitle: "Что внутри кристалла и зачем он нужен",
    color: "#0071e3",
    lessons: [
      {
        id: "what",
        title: "Что такое ESP32",
        minutes: 8,
        viz: "board",
        body: [
          "ESP32 — это система на кристалле от Espressif: два ядра Xtensa, Wi‑Fi, Bluetooth, богатая периферия. Это не «Arduino с антенной», а полноценный SoC для интернета вещей.",
          "На учебной плате DevKit обычно стоят USB‑UART мост (часто CP2102 или CH340), стабилизатор 3.3 В, кнопка EN (сброс) и BOOT (GPIO0). Сам чип питается только 3.3 В — 5 В с USB на GPIO подавать нельзя.",
        ],
        bullets: [
          "Два ядра до ~240 МГц, SRAM, Flash снаружи",
          "Wi‑Fi 802.11 b/g/n и Bluetooth Classic / BLE",
          "GPIO, ADC, DAC, I2C, SPI, UART, PWM, I2S, touch, Hall",
        ],
        quiz: {
          q: "Какое напряжение питания у GPIO ESP32?",
          options: ["5 В, как у классической Arduino UNO", "3.3 В логика", "12 В через VIN", "Любое от 1.8 до 5 В"],
          answer: 1,
        },
      },
      {
        id: "toolchain",
        title: "Arduino IDE и ESP-IDF",
        minutes: 10,
        viz: "board",
        body: [
          "Два основных пути: Arduino‑ядро espressif/arduino-esp32 — быстрее стартовать; ESP‑IDF — официальный SDK с FreeRTOS, менюconfig и компонентами.",
          "Для обучения удобно начать с Arduino, но понимать, что под капотом всё равно IDF: setup()/loop() крутятся в задаче Arduino, а Wi‑Fi живёт в своих задачах.",
        ],
        bullets: [
          "Плата: ESP32 Dev Module, скорость 115200",
          "При загрузке: BOOT зажат, если автосброс не сработал",
          "Partition scheme: Default 4MB достаточно для курса",
        ],
        code: `#include <Arduino.h>

void setup() {
  Serial.begin(115200);
  Serial.println("Spark32: плата жива");
}

void loop() {
  Serial.printf("uptime %lu ms\\n", millis());
  delay(1000);
}`,
        quiz: {
          q: "Где выполняется loop() в Arduino-ядре ESP32?",
          options: [
            "В прерывании таймера",
            "Как задача FreeRTOS",
            "На отдельном радио-процессоре",
            "Только на ядре 1 без планировщика",
          ],
          answer: 1,
        },
      },
    ],
  },
  {
    id: "gpio",
    title: "GPIO и сигналы",
    subtitle: "Цифра, ШИМ, АЦП — руками на пинах",
    color: "#30d158",
    lessons: [
      {
        id: "digital",
        title: "Цифровой ввод и вывод",
        minutes: 12,
        viz: "gpio",
        body: [
          "pinMode задаёт направление. OUTPUT — вы сами тянете пин вверх или вниз. INPUT — читаете внешний уровень. INPUT_PULLUP включает внутренний резистор к 3.3 В: кнопка на GND даёт LOW при нажатии.",
          "Не все пины равны. GPIO 6–11 заняты Flash. GPIO 34–39 только вход. GPIO 0, 2, 12, 15 влияют на загрузку — осторожно со strapping.",
        ],
        code: `const int LED = 2;      // часто встроенный LED
const int BTN = 0;      // BOOT

void setup() {
  pinMode(LED, OUTPUT);
  pinMode(BTN, INPUT_PULLUP);
}

void loop() {
  digitalWrite(LED, digitalRead(BTN) == LOW);
}`,
        quiz: {
          q: "Почему кнопку чаще вешают на GND и INPUT_PULLUP?",
          options: [
            "Так пин выдерживает 5 В",
            "Внутренний резистор держит HIGH, нажатие даёт надёжный LOW",
            "Pull-up экономит ток лучше, чем pull-down",
            "BOOT всегда требует внешние 10 кОм",
          ],
          answer: 1,
        },
      },
      {
        id: "pwm",
        title: "PWM: яркость и моторы",
        minutes: 11,
        viz: "pwm",
        body: [
          "LEDC‑периферия ESP32 даёт аппаратный ШИМ: канал, таймер, частота, разрядность. analogWrite в новом ядре поверх LEDC, но явно вызывать ledcSetup/ledcAttachPin понятнее.",
          "Для светодиода хватит 5 кГц и 8 бит. Для серво — 50 Гц и импульс 1–2 мс. Для мотора через драйвер — частота выше слышимого диапазона.",
        ],
        code: `const int PIN = 18;

void setup() {
  ledcSetup(0, 5000, 8);
  ledcAttachPin(PIN, 0);
}

void loop() {
  for (int d = 0; d <= 255; d++) {
    ledcWrite(0, d);
    delay(8);
  }
}`,
        quiz: {
          q: "Какая периферия ESP32 отвечает за ШИМ?",
          options: ["MCPWM только", "LEDC (и отдельно MCPWM для моторов)", "RMT", "I2S DAC"],
          answer: 1,
        },
      },
      {
        id: "adc",
        title: "АЦП: датчики и шумы",
        minutes: 10,
        viz: "gpio",
        body: [
          "ESP32 имеет два АЦП. ADC1 (GPIO 32–39) дружит с Wi‑Fi. ADC2 конфликтует с Wi‑Fi — analogRead на ADC2 во время радио может врать.",
          "Характеристика не идеально линейна, есть Wi‑Fi шум. Для точных измерений берут внешний ADC (ADS1115) или усреднение и калибровку.",
        ],
        code: `void setup() { Serial.begin(115200); analogReadResolution(12); }

void loop() {
  int raw = analogRead(34);
  float v = raw * 3.3 / 4095.0;
  Serial.printf("ADC %d  ~ %.2f V\\n", raw, v);
  delay(200);
}`,
        quiz: {
          q: "Какой АЦП безопаснее использовать вместе с Wi‑Fi?",
          options: ["ADC2", "ADC1", "Только DAC", "Любой GPIO"],
          answer: 1,
        },
      },
    ],
  },
  {
    id: "buses",
    title: "Шины",
    subtitle: "UART, I2C, SPI — разговор с периферией",
    color: "#bf5af2",
    lessons: [
      {
        id: "uart",
        title: "UART и Serial",
        minutes: 9,
        viz: "bus",
        body: [
          "UART — асинхронная пара TX/RX плюс общая земля. Serial — UART0 на USB. Serial2 часто вешают на GPIO 16/17 для GPS, модема, другого МК.",
          "Скорость, биты, стоп, чётность должны совпасть. Для длинного кабеля снижайте бод и не забывайте общий GND.",
        ],
        code: `void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, 16, 17);
}
void loop() {
  if (Serial2.available()) Serial.write(Serial2.read());
}`,
        quiz: {
          q: "Что обязательно кроме TX и RX?",
          options: ["Тактовая линия CLK", "Общий GND", "Питание 5 В", "Chip Select"],
          answer: 1,
        },
      },
      {
        id: "i2c",
        title: "I2C: два провода, много чипов",
        minutes: 10,
        viz: "bus",
        body: [
          "SDA и SCL, открытый сток, подтяжки 2.2–10 кОм к 3.3 В. Каждый чип имеет адрес. На DevKit по умолчанию часто SDA=21, SCL=22.",
          "Сканер адресов — первый ритуал, если OLED «не нашёлся». Не смешивайте 5 В устройства без level shifter.",
        ],
        code: `#include <Wire.h>
void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  for (uint8_t a = 1; a < 127; a++) {
    Wire.beginTransmission(a);
    if (Wire.endTransmission() == 0) Serial.printf("found 0x%02X\\n", a);
  }
}`,
        quiz: {
          q: "Типичные пины I2C на ESP32 DevKit?",
          options: ["GPIO 1 и 3", "GPIO 21 и 22", "GPIO 6 и 7", "GPIO 34 и 35"],
          answer: 1,
        },
      },
      {
        id: "spi",
        title: "SPI: быстро к дисплеям и Flash",
        minutes: 9,
        viz: "bus",
        body: [
          "MOSI, MISO, SCK и отдельный CS на устройство. VSPI часто: SCK 18, MISO 19, MOSI 23, CS 5. Дисплеи ILI9341, SD‑карты, NRF24 — все сюда.",
          "Flash чипа сидит на отдельном SPI — эти пины не трогаем.",
        ],
        quiz: {
          q: "Зачем линия CS?",
          options: ["Питание ведомого", "Выбор, с каким чипом говорит мастер", "Сброс шины", "Тактовый строб I2C"],
          answer: 1,
        },
      },
    ],
  },
  {
    id: "radio",
    title: "Wi‑Fi и Bluetooth",
    subtitle: "Сеть, точки доступа, BLE‑маяки",
    color: "#64d2ff",
    lessons: [
      {
        id: "wifi-sta",
        title: "STA: подключение к роутеру",
        minutes: 12,
        viz: "wifi",
        body: [
          "WiFi.mode(WIFI_STA) и WiFi.begin(ssid, pass). События лучше, чем слепой delay: WL_CONNECTED, потеря линка, реконнект.",
          "Не храните пароль в репозитории. Для продукта — NVS, WiFiManager или SoftAP с порталом.",
        ],
        code: `#include <WiFi.h>
void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin("home", "secret");
  while (WiFi.status() != WL_CONNECTED) delay(200);
  Serial.println(WiFi.localIP());
}
void loop() {}`,
        quiz: {
          q: "Что делает режим STA?",
          options: [
            "Раздаёт свою сеть",
            "Подключается к существующей точке доступа",
            "Только BLE",
            "Выключает радио",
          ],
          answer: 1,
        },
      },
      {
        id: "wifi-ap",
        title: "Точка доступа и веб‑сервер",
        minutes: 12,
        viz: "wifi",
        body: [
          "SoftAP поднимает сеть ESP32‑XXXX. WebServer на порту 80 отдаёт HTML и принимает формы. Так делают первичную настройку без приложения.",
          "Совмещённый AP+STA удобен, но ест RAM. На ESP32‑C3 её меньше — страницы держите лёгкими.",
        ],
        quiz: {
          q: "Типичный IP SoftAP по умолчанию?",
          options: ["192.168.1.1", "192.168.4.1", "10.0.0.1", "DHCP от роутера"],
          answer: 1,
        },
      },
      {
        id: "ble",
        title: "Bluetooth Low Energy",
        minutes: 11,
        viz: "wifi",
        body: [
          "BLE — GATT: сервис и характеристики. Телефон видит устройство, читает/пишет значения, получает notify. Classic Bluetooth — аудио и SPP, для датчиков чаще BLE.",
          "Имя, UUID и реклама настраиваются. Не держите Wi‑Fi и BLE на полной мощности без нужды — ток и сосуществование радио.",
        ],
        quiz: {
          q: "Базовая модель данных BLE?",
          options: ["MQTT топики", "GATT сервисы и характеристики", "HTTP REST", "Modbus регистры"],
          answer: 1,
        },
      },
    ],
  },
  {
    id: "rtos",
    title: "FreeRTOS и энергия",
    subtitle: "Задачи, очереди, глубокий сон",
    color: "#ff9f0a",
    lessons: [
      {
        id: "tasks",
        title: "Два ядра и задачи",
        minutes: 13,
        viz: "sleep",
        body: [
          "xTaskCreatePinnedToCore запускает функцию как поток. Ядро 0 часто занято Wi‑Fi. Тяжёлый цикл на ядре 1 не душит радио.",
          "delay() внутри задачи отдаёт процессор. spin-loop без vTaskDelay заморозит планировщик на этом ядре. Общие данные — mutex или очередь.",
        ],
        code: `void worker(void*) {
  for (;;) {
    Serial.println("tick");
    vTaskDelay(pdMS_TO_TICKS(500));
  }
}
void setup() {
  Serial.begin(115200);
  xTaskCreatePinnedToCore(worker, "w", 2048, NULL, 1, NULL, 1);
}
void loop() { vTaskDelay(1000); }`,
        quiz: {
          q: "Почему тяжёлый код лучше пинить на ядро 1?",
          options: [
            "Ядро 1 быстрее тактуется",
            "Протокольный стек Wi‑Fi обычно живёт на ядре 0",
            "GPIO работают только с ядра 1",
            "Arduino loop нельзя трогать",
          ],
          answer: 1,
        },
      },
      {
        id: "sleep",
        title: "Режимы сна",
        minutes: 10,
        viz: "sleep",
        body: [
          "modem sleep, light sleep, deep sleep. В deep sleep CPU выключен, живёт RTC. Просыпание: таймер, EXT0/EXT1, touch. Данные — RTC_DATA_ATTR.",
          "Перед сном отключайте периферию и Wi‑Fi. Ток может упасть до десятков микроампер — месяцы на батарее для редких измерений.",
        ],
        code: `#define uS 1000000ULL
void setup() {
  Serial.begin(115200);
  esp_sleep_enable_timer_wakeup(10 * uS);
  Serial.println("sleep");
  delay(100);
  esp_deep_sleep_start();
}
void loop() {}`,
        quiz: {
          q: "Что сохраняется в deep sleep без внешней памяти?",
          options: ["Весь SRAM", "RTC память и RTC периферия", "Кэш инструкций", "Сессия Wi‑Fi всегда"],
          answer: 1,
        },
      },
    ],
  },
];

export const allLessons = courses.flatMap((c) =>
  c.lessons.map((l) => ({ ...l, courseId: c.id, courseTitle: c.title })),
);
