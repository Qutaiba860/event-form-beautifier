from django.db import models

class Tag(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class PermissionLevel(models.Model):
    level = models.CharField(max_length=100)

    def __str__(self):
        return self.level

class PermissionType(models.Model):
    type = models.CharField(max_length=100)

    def __str__(self):
        return self.type

class Role(models.Model):
    name = models.CharField(max_length=100)
    permission_level = models.ForeignKey(PermissionLevel, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class PermissionLevelType(models.Model):
    permission_level = models.ForeignKey(PermissionLevel, on_delete=models.CASCADE)
    permission_type = models.ForeignKey(PermissionType, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('permission_level', 'permission_type')

    def __str__(self):
        return f"{self.permission_level} - {self.permission_type}"
