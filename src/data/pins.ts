import type { Pin } from "../types";

const L: Array<[string, number | undefined, string[], string]> = [
  ["3V3", undefined, ["PWR"], "Стабильные 3.3 В для логики и датчиков. Не сажайте сюда моторы."],
  ["EN", undefined, ["RESET"], "Сброс чипа. Низкий уровень держит ESP32 в reset."],
  ["SVP", 36, ["ADC1", "IN"], "GPIO36, только вход, ADC1_CH0. Датчики, не выход."],
  ["SVN", 39, ["ADC1", "IN"], "GPIO39, только вход, ADC1_CH3."],
  ["IO34", 34, ["ADC1", "IN"], "Только вход. Удобен при включённом Wi‑Fi."],
  ["IO35", 35, ["ADC1", "IN"], "Только вход, ADC1."],
  ["IO32", 32, ["ADC1", "TOUCH"], "Вход/выход, тач, АЦП. Можно XTAL32."],
  ["IO33", 33, ["ADC1", "TOUCH"], "Пара к 32, часто вторая ось."],
  ["IO25", 25, ["DAC1", "ADC2"], "ЦАП 8 бит. Можно аналоговый выход без ШИМ."],
  ["IO26", 26, ["DAC2", "ADC2"], "Второй ЦАП. Реле и аудиозаготовки."],
  ["IO27", 27, ["TOUCH", "ADC2"], "Универсальный GPIO."],
  ["IO14", 14, ["HSPI", "PWM"], "HSPI CLK. Strapping слабо критичен."],
  ["IO12", 12, ["HSPI", "STRAP"], "Опасно на старте: высокий уровень может мешать прошивке."],
  ["GND", undefined, ["PWR"], "Земля. Соединяйте с модулями всегда."],
  ["IO13", 13, ["HSPI", "PWM"], "HSPI MOSI, LEDC."],
  ["D2", 9, ["FLASH"], "Занят Flash. Не используйте на WROOM."],
  ["D3", 10, ["FLASH"], "Занят Flash."],
  ["CMD", 11, ["FLASH"], "Занят Flash."],
  ["5V", undefined, ["PWR"], "С USB. В чип напрямую не подавать. VIN модуля."],
];

const R: Array<[string, number | undefined, string[], string]> = [
  ["GND", undefined, ["PWR"], "Земля правого ряда."],
  ["IO23", 23, ["VSPI", "MOSI"], "VSPI MOSI — дисплеи и SD."],
  ["IO22", 22, ["I2C", "SCL"], "SCL по умолчанию в Arduino-ядре."],
  ["TX", 1, ["UART0"], "Лог в USB. Не занимайте без нужды."],
  ["RX", 3, ["UART0"], "Приём USB-UART."],
  ["IO21", 21, ["I2C", "SDA"], "SDA по умолчанию."],
  ["IO19", 19, ["VSPI", "MISO"], "VSPI MISO."],
  ["IO18", 18, ["VSPI", "SCK"], "VSPI SCK. Удобный ШИМ."],
  ["IO5", 5, ["VSPI", "CS", "STRAP"], "Часто CS. Strapping: должен быть HIGH при загрузке."],
  ["IO17", 17, ["UART2", "TX"], "Serial2 TX."],
  ["IO16", 16, ["UART2", "RX"], "Serial2 RX."],
  ["IO4", 4, ["TOUCH", "ADC2"], "Свободный GPIO, иногда встроенный Flash CS на других модулях — на DevKit ок."],
  ["IO0", 0, ["BOOT", "STRAP"], "Низкий — режим загрузчика. Кнопка BOOT."],
  ["IO2", 2, ["LED", "STRAP"], "Часто встроенный LED. Низкий на старте предпочтителен."],
  ["IO15", 15, ["STRAP"], "TDO. Высокий на старте."],
  ["D1", 8, ["FLASH"], "Занят Flash."],
  ["D0", 7, ["FLASH"], "Занят Flash."],
  ["CLK", 6, ["FLASH"], "Занят Flash."],
  ["3V3", undefined, ["PWR"], "Вторая точка 3.3 В."],
];

function mapSide(side: "left" | "right", rows: typeof L): Pin[] {
  return rows.map((row, index) => ({
    id: `${side}-${index}`,
    side,
    index,
    label: row[0],
    gpio: row[1],
    roles: row[2],
    note: row[3],
  }));
}

export const pins: Pin[] = [...mapSide("left", L), ...mapSide("right", R)];
