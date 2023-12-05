int xPin =  A0;
int yPin = A1;
int buttonVal;
int buttonPin = 6;
int xVal;
int yVal;
int dt = 100;

void setup() {
  // put your setup code here, to run once:
  pinMode(buttonPin, INPUT);
  digitalWrite(buttonPin, HIGH);
  Serial.begin(9600);

}

void loop() {
  // put your main code here, to run repeatedly:
xVal = analogRead(xPin);
yVal = analogRead(yPin);
buttonVal = digitalRead(buttonPin);
//Serial.print("pos,");
Serial.print(xVal);
Serial.print(",");
//Serial.print("Y: ");
Serial.print(yVal);
//pos,200,100
Serial.print(",");
//Serial.print("B: ");
Serial.println(buttonVal);
//Serial.println();
delay(dt);

} 