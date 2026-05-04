const { DataTypes } = require("sequelize");

const db = require("../config/db");
const { SERVICE_TYPES } = require("../constants");

const Topic = db.define(
  "Topic",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contentURL: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contentThumbnail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    serviceType: {
      type: DataTypes.ENUM(SERVICE_TYPES.PREMIUM, SERVICE_TYPES.FREE),
      allowNull: false,
      defaultValue: SERVICE_TYPES.PREMIUM,
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    revisionRecall: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hiddenLinks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    exerciseRevival: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    masterExemplar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pyq: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    chapterCheckpoint: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    chapterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "chapters",
        key: "id",
      },
    },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "subjects",
        key: "id",
      },
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "classes",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    tableName: "topics",
  }
);

Topic.associate = (models) => {
  Topic.belongsTo(models.Chapter, {
    foreignKey: "chapterId",
    onDelete: "CASCADE",
  });

  Topic.belongsTo(models.Subject, {
    foreignKey: "subjectId",
    onDelete: "CASCADE",
  });

  Topic.belongsTo(models.Class, {
    foreignKey: "classId",
    onDelete: "CASCADE",
  });

  Topic.hasMany(models.Favorite, {
    foreignKey: "topicId",
    onDelete: "CASCADE",
  });

  Topic.hasMany(models.LastRead, {
    foreignKey: "topicId",
    onDelete: "CASCADE",
  });
};

module.exports = Topic;
