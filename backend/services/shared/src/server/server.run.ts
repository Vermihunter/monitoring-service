import { Application } from "express";

export default function run(app: Application, port: number) {
  return app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });
}
