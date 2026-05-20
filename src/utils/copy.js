export function memberLabels(orgType) {
  if (orgType === "corporate") {
    return {
      member: "Employee",
      members: "Employees",
    };
  }
  return {
    member: "Student",
    members: "Students",
  };
}
