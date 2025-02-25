import paramiko


if output == "Installed":
    print("✅ Nginx is installed.")
else:
    print("❌ Nginx is NOT installed.")

# **Test Case 2: Check if Nginx is running**
print(f"Checking if {PACKAGE} service is running on {EC2_IP}...")
output, error = execute_ssh_command(f"systemctl is-active {PACKAGE}")

if output == "active":
    print("✅ Nginx service is running.")
else:
    print("❌ Nginx service is NOT running.")