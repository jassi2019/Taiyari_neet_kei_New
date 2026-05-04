const { Topic } = require("../../models");
const { getDesign, getDesignViewUrl } = require("../../services/canva");

const updateV1 = async (req, res, next) => {
  try {
    const { topicId } = req.params;

    const {
      name,
      description,
      contentId,
      contentURL,
      sequence,
      serviceType,
      chapterId,
      subjectId,
      classId,
      explanation,
      revisionRecall,
      hiddenLinks,
      exerciseRevival,
      masterExemplar,
      pyq,
      chapterCheckpoint,
    } = req.body;

    let contentThumbnail = undefined;
    let resolvedContentURL = contentURL;

    if (contentId) {
      const {
        design,
      } = await getDesign(contentId);

      if (typeof design?.thumbnail?.url === "string" && design.thumbnail.url.trim()) {
        contentThumbnail = design.thumbnail.url.trim();
      }
      resolvedContentURL = getDesignViewUrl(design) || contentURL;
    }

    const updateData = {
      name,
      description,
      contentURL: resolvedContentURL,
      contentThumbnail,
      contentId,
      sequence,
      serviceType,
      chapterId,
      subjectId,
      classId,
    };

    // Only include feature fields if they are explicitly provided
    if (explanation !== undefined) updateData.explanation = explanation;
    if (revisionRecall !== undefined) updateData.revisionRecall = revisionRecall;
    if (hiddenLinks !== undefined) updateData.hiddenLinks = hiddenLinks;
    if (exerciseRevival !== undefined) updateData.exerciseRevival = exerciseRevival;
    if (masterExemplar !== undefined) updateData.masterExemplar = masterExemplar;
    if (pyq !== undefined) updateData.pyq = pyq;
    if (chapterCheckpoint !== undefined) updateData.chapterCheckpoint = chapterCheckpoint;

    const doc = await Topic.update(updateData, { where: { id: topicId } });

    return res
      .status(200)
      .json({ message: "Topic updated successfully", data: doc });
  } catch (error) {
    next(error);
  }
};

module.exports = updateV1;
