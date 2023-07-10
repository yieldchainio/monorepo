const { exec, execSync } = require("child_process");

const args = process.argv;

const desiredServiceName = args[2];
if (!desiredServiceName) throw "[GetServideByTag]: Service ARNs are undefined";

const services = JSON.parse(
  execSync("aws ecs list-services --cluster YC-Cluster").toString()
).serviceArns;

for (const serviceArn of services) {
  const tags = JSON.parse(
    execSync(
      "aws ecs list-tags-for-resource --resource-arn " + serviceArn
    ).toString()
  ).tags;

  const hasDesiredTag = tags.some(
    (tag) => tag.key == "SERVICE_NAME" && tag.value == desiredServiceName
  );

  if (hasDesiredTag) {
    process.stdout.write(
      serviceArn.split(
        "arn:aws:ecs:us-east-1:010073361729:service/YC-Cluster/"
      )[1]
    );
    break;
  }
}
